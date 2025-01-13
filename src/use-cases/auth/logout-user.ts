import { ICognitoAuth } from "../../app/auth/cognito-service.js";
import { AuthError } from "../../shared/error/auth-error.js";

export const logoutUser =
  (cognitoAuth: ICognitoAuth) =>
  async (sessionId: string): Promise<void> => {
    if (!sessionId) throw new AuthError("Session ID is required");

    return await cognitoAuth.logoutUser(sessionId);
  };
