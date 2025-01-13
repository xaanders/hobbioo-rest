// src/controllers/user-controller.ts
import { User } from "../entities/user.js";
import { HttpRequest, HttpResponse } from "../express/callback.js";
import { handleAuthError, handleError } from "../express/error-handler.js";
import { AuthError } from "../shared/error/auth-error.js";
import { IHelpers } from "../app/helpers/IHelpers.js";

type LoginUserFn = (username: string, password: string) => Promise<string>;

export const loginController =
  (loginUser: LoginUserFn, helpers: IHelpers) =>
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
        body: helpers.isProductionData({ sessionId: sessionId }, { message: "Login successful" }),
      };
    } catch (error) {
      return handleAuthError(error) || handleError(error);
    }
  };

type CreateUserFn = (data: {
  first_name: string;
  last_name: string;
  email: string;
  user_type: 1 | 2;
  password: string;
}) => Promise<Partial<User>>;

export const registerUserController =
  (createUser: CreateUserFn, helpers: IHelpers) =>
  async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    const { first_name, last_name, email, user_type, password } = httpRequest.body as {
      first_name: string;
      last_name: string;
      email: string;
      user_type: 1 | 2;
      password: string;
    };
    try {
      const user = await createUser({ first_name, last_name, email, user_type, password });
      return { statusCode: 201, body: user };
    } catch (error) {
      if (error instanceof AuthError) helpers.logger(`Register user: ${error.debug}`, "error");

      return handleAuthError(error) || handleError(error);
    }
  };

type LogoutUserFn = (sessionId: string) => Promise<void>;

export const logoutController = (logoutUser: LogoutUserFn) => {
  return async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    const sessionId = httpRequest.headers.Authorization as string;

    await logoutUser(sessionId);
    return {
      statusCode: 200,
      body: { message: "Logout successful" },
      headers: { "Set-Cookie": `sessionId=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/` },
    };
  };
};

type ConfirmUserEmailFn = (username: string, code: string) => Promise<string>;

export const confirmUserEmailController = (
  confirmUserEmail: ConfirmUserEmailFn,
  helpers: IHelpers
) => {
  return async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    const { username, code } = httpRequest.query as { username: string; code: string };

    try {
      const message = await confirmUserEmail(username, code);
      return { statusCode: 200, body: message };
    } catch (error) {
      if (error instanceof AuthError) helpers.logger(`Email confirmation: ${error.debug}`, "error");

      return handleAuthError(error) || handleError(error);
    }
  };
};
