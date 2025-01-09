import { ICognitoAuth } from "../app/auth/cognito-service.js";
import { AuthError } from "../shared/error/auth-error.js";

export const loginUser =
  (cognitoAuth: ICognitoAuth) =>
  async (username: string, password: string): Promise<string> => {
    if (!username || !password) {
      throw new AuthError("Username and password are required");
    }

    return await cognitoAuth.authenticateUser(username, password);
  };
