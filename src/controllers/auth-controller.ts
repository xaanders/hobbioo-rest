import { HttpRequest, HttpResponse } from "../express-callback/index.js";
import { handleAuthError } from "./error-handler.js";

type LoginUserFn = (username: string, password: string) => Promise<string>;

export const loginController = (loginUser: LoginUserFn) => async (httpRequest: HttpRequest): Promise<HttpResponse> => {

  const { username, password }  = httpRequest.body as { username: string, password: string };

  try {
    const sessionId = await loginUser(username, password);
    return {
      statusCode: 200,
      body: { sessionId }
    };
  } catch (error) {
    return handleAuthError(error);
  }
}; 