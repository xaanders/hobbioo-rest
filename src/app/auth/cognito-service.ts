/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CognitoIdentityProvider,
  InitiateAuthCommandInput,
  SignUpCommandInput,
  SignUpCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";
import jwt from "jsonwebtoken";
import { ISessionManager } from "../../gateways/session-manager.js";
import { createPublicKey } from "crypto";
import axios from "axios";
import { UserSession } from "../../shared/types.js";
import { AuthError } from "../../shared/error/auth-error.js";

interface JWK {
  kid: string;
  alg: string;
  kty: string;
  e: string;
  n: string;
  use: string;
}

const cachedKeys: { [key: string]: string } = {};

export interface ICognitoAuth {
  authenticateUser(username: string, password: string): Promise<string>;
  registerUser(user: {
    username: string;
    password: string;
    id: string;
    name: string;
  }): Promise<SignUpCommandOutput>;
  verifyToken(token: string): Promise<any>;
}

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

  async function authenticateUser(username: string, password: string): Promise<string> {
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

    const sessionId = await sessionManager.createSession(decoded as UserSession, expiresIn);

    return sessionId;
  }

  async function registerUser(user: {
    username: string;
    password: string;
    id: string;
    name: string;
  }): Promise<SignUpCommandOutput> {
    const params: SignUpCommandInput = {
      ClientId: clientId, // Replace with your Cognito App Client ID
      Username: user.username, // This can be the email
      Password: user.password,
      // SecretHash: getSecretHash(user.username),
      UserAttributes: [
        { Name: "email", Value: user.username },
        { Name: "name", Value: user.name },
        // { Name: "custom:user_id", Value: user.id },
      ],
    };
    console.log("Registering user:", params);
    const response: SignUpCommandOutput = await cognito.signUp(params);

    return response;
  }

  return {
    authenticateUser,
    registerUser,
    verifyToken,
  };
}
