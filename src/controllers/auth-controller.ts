// src/controllers/user-controller.ts
import { User } from "../entities/user.js";
import { HttpRequest, HttpResponse } from "../express-callback/index.js";
import { handleAuthError, handleError } from "./error-handler.js";
import { AuthError } from "../shared/error/auth-error.js";
import { IHelpers } from "../shared/interfaces.js";

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
        console.log("error:", error)
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
  (createUser: CreateUserFn) =>
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

        if (!user || !user.id) throw new AuthError("User not created");

        return { statusCode: 201, body: user };
      } catch (error: any) {
        console.log("error:", error)
        return handleAuthError(error) || handleError(error);
      };
    };
