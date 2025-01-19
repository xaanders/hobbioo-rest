import { ConfirmSignUpCommandOutput } from "@aws-sdk/client-cognito-identity-provider";
import { SignUpCommandOutput } from "@aws-sdk/client-cognito-identity-provider";
import { Session, UserSession } from "./types.js";
import { User } from "../../entities/user.js";

export interface ISessionManager {
  createSession(userSession: UserSession, user: User, expiresIn: number): Promise<string>;
  getSession(sessionId: string): Promise<Session | null>;
  removeSession(sessionId: string): Promise<void>;
}

export interface ICognitoAuth {
    authenticateUser(username: string, password: string): Promise<{ session: UserSession, expiresIn: number }>;
    registerUser(user: {
      username: string;
      password: string;
      id: string;
      name: string;
    }): Promise<SignUpCommandOutput>;
    verifyToken(token: string): Promise<any>;
    confirmEmail(username: string, code: string): Promise<ConfirmSignUpCommandOutput>;
    logoutUser(sessionId: string): Promise<void>;
  }