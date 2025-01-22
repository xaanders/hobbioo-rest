import { ICognitoAuth } from "../../app/auth/interfaces.js";
import { ISessionManager } from "../../app/auth/interfaces.js";
import { IUserRepository } from "../../gateways/user-repository.js";
import { AuthError } from "../../shared/error/auth-error.js";

export const loginUser =
  (cognitoAuth: ICognitoAuth, sessionManager: ISessionManager, userRepository: IUserRepository) =>
    async (username: string, password: string): Promise<string> => {
      if (!username || !password) {
        throw new AuthError("Username and password are required");
      }

      const { session, expiresIn } = await cognitoAuth.authenticateUser(username, password);

      const user = await userRepository.getUser(session['custom:user_id']);

      if (!user) throw new AuthError("User not found");

      const sessionId = await sessionManager.createSession(session, user, expiresIn);

      return sessionId;
    };
