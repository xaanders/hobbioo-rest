/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CognitoIdentityProvider,
  InitiateAuthCommandInput,
  SignUpCommandInput,
  SignUpCommandOutput,
  ConfirmSignUpCommandInput,
  ConfirmSignUpCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";
import jwt from "jsonwebtoken";
import { createPublicKey } from "crypto";
import axios from "axios";
import { UserSession } from "./types.js";
import { AuthError } from "../../shared/error/auth-error.js";
import { ISessionManager, ICognitoAuth } from "./interfaces.js";

interface JWK {
  kid: string;
  alg: string;
  kty: string;
  e: string;
  n: string;
  use: string;
}

const cachedKeys: { [key: string]: string } = {};

export function createCognitoAuth(
  cognito: CognitoIdentityProvider,
  sessionManager: ISessionManager,
  userPoolId: string,
  clientId: string
): ICognitoAuth {
  async function getPublicKey(token: string): Promise<string> {
    const decodedToken = jwt.decode(token, { complete: true });

    if (!decodedToken || typeof decodedToken === "string" || !decodedToken.header.kid)
      throw new AuthError(
        "Invalid token",
        "Decoded token is invalid: " + JSON.stringify(decodedToken)
      );

    const kid = decodedToken.header.kid;
    if (cachedKeys[kid]) return cachedKeys[kid];

    const url = `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
    const { data } = await axios.get(url);

    const key = (data.keys as JWK[]).find((k) => k.kid === kid);
    if (!key) throw new Error("Public key not found");

    // Convert JWK to PEM using Node's crypto
    const pubKey = createPublicKey({
      key: {
        kty: key.kty,
        n: key.n,
        e: key.e,
      },
      format: "jwk",
    });

    const pem = pubKey.export({ type: "spki", format: "pem" }).toString();
    cachedKeys[kid] = pem;

    return pem;
  }

  async function verifyToken(token: string): Promise<any> {
    const publicKey = await getPublicKey(token);
    return new Promise((resolve, reject) => {
      jwt.verify(token, publicKey, { algorithms: ["RS256"] }, (err, decoded) => {
        if (err) reject(err);
        resolve(decoded);
      });
    });
  }

  async function authenticateUser(
    username: string,
    password: string
  ): Promise<{ session: UserSession; expiresIn: number }> {
    const params = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    };
    const response = await cognito.initiateAuth(params as InitiateAuthCommandInput);
    const idToken = response.AuthenticationResult?.IdToken;

    if (!idToken) throw new AuthError("Authentication failed", "No idToken found");

    const decoded = await verifyToken(idToken);
    const expiresIn = response.AuthenticationResult?.ExpiresIn;

    if (!expiresIn)
      throw new AuthError(
        "Authentication failed",
        "No response.AuthenticationResult?.ExpiresIn found"
      );

    return { session: decoded, expiresIn: expiresIn };
  }

  async function registerUser(user: {
    username: string;
    password: string;
    id: string;
    name: string;
  }): Promise<SignUpCommandOutput> {
    const params: SignUpCommandInput = {
      ClientId: clientId,
      Username: user.username,
      Password: user.password,
      UserAttributes: [
        { Name: "email", Value: user.username },
        { Name: "name", Value: user.name },
        { Name: "custom:user_id", Value: user.id },
      ],
    };

    return await cognito.signUp(params);
  }

  async function confirmEmail(username: string, code: string): Promise<ConfirmSignUpCommandOutput> {
    const params = {
      Username: username,
      UserPoolId: userPoolId,
      ConfirmationCode: code,
      ClientId: clientId,
    };

    return await cognito.confirmSignUp(params as ConfirmSignUpCommandInput);
  }

  async function logoutUser(sessionId: string): Promise<void> {
    await sessionManager.removeSession(sessionId);
  }

  return {
    authenticateUser,
    registerUser,
    verifyToken,
    confirmEmail,
    logoutUser,
  };
}
