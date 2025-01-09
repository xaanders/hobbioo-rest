// src/controllers/user-controller.ts
import { User } from "../entities/user.js";
import { HttpRequest, HttpResponse } from "../express-callback/index.js";
import { handleAuthError, handleError } from "./error-handler.js";
import logger from "../logger/index.js";
import { ICognitoAuth } from "../app/auth/cognito-service.js";
import { SignUpCommandOutput } from "@aws-sdk/client-cognito-identity-provider";
import { AuthError } from "../shared/error/auth-error.js";
import { isDevelopment } from "../shared/helpers.js";

type LoginUserFn = (username: string, password: string) => Promise<string>;

export const loginController =
  (loginUser: LoginUserFn) =>
  async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    const { username, password } = httpRequest.body as { username: string; password: string };

    try {
      const sessionId = await loginUser(username, password);

      return {
        statusCode: 200,
        headers: {
          "Set-Cookie": `sessionId=${sessionId}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600; Path=/`,
        },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        body: isDevelopment({ sessionId: sessionId }, { message: "Login successful" }),
      };
    } catch (error) {
      return handleAuthError(error);
    }
  };

type CreateUserFn = (data: {
  first_name: string;
  last_name: string;
  email: string;
  user_type: 1 | 2;
}) => Promise<Partial<User>>;

export const registerUserController =
  (createUser: CreateUserFn, cognitoAuth: ICognitoAuth) =>
  async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    const { first_name, last_name, email, user_type, password } = httpRequest.body as {
      first_name: string;
      last_name: string;
      email: string;
      user_type: 1 | 2;
      password: string;
    };

    try {
      const user = await createUser({ first_name, last_name, email, user_type });

      if (!user || !user.id) throw new AuthError("User not created", JSON.stringify(user));

      const cognitoUser: SignUpCommandOutput = await cognitoAuth.registerUser({
        username: email,
        password: password,
        id: user.id,
        name: `${first_name} ${last_name}`,
      });

      if (!cognitoUser)
        throw new AuthError(
          "Couldn't register user. Please one more time.",
          JSON.stringify({ user, cognitoUser })
        );

      logger.info("Registered new user", { user, cognitoUser });

      return { statusCode: 201, body: user };
    } catch (error) {
      return handleError(error);
    }
  };
