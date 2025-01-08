/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CognitoIdentityProvider, InitiateAuthCommandInput, InitiateAuthCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import jwt from 'jsonwebtoken';
import { ISessionManager } from '../../gateways/session-manager.js';

export interface ICognitoAuth {
  authenticateUser(username: string, password: string): Promise<string>;
  verifyToken(token: string): Promise<any>;
}

export function createCognitoAuth(
  cognito: CognitoIdentityProvider,
  sessionManager: ISessionManager, 
  userPoolId: string,
  clientId: string
): ICognitoAuth {
  async function authenticateUser(username: string, password: string): Promise<string> {
    console.log("Authenticating user:", username);
    console.log("Password:", password);
    console.log("Client ID:", clientId);
    console.log("User Pool ID:", userPoolId);

    const params: InitiateAuthCommandInput = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    };

    const response: InitiateAuthCommandOutput = await cognito.initiateAuth(params);
    console.log("Response:", response);
    const idToken = response.AuthenticationResult?.IdToken;
    
    if (!idToken) throw new Error('Authentication failed');

    const decoded = await verifyToken(idToken as string);
    const sessionId = await sessionManager.createSession(decoded);
    
    return sessionId;
  }

  async function verifyToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, getPublicKey(), { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) reject(err);
        resolve(decoded);
      });
    });
  }

  function getPublicKey(): string {
    // Implement JWT public key retrieval from Cognito
    // You can cache this key
    return '';
  }

  return {
    authenticateUser,
    verifyToken
  };
}