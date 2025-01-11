// src/controllers/user-controller.ts
import { User } from "../entities/user.js";
import { HttpRequest, HttpResponse } from "../express/callback.js";
// import { handleError } from "./error-handler.js";

type GetUserFn = (id: string) => Promise<Partial<User> | null>;

export const getUserController =
  (getUser: GetUserFn) =>
    async (httpRequest: HttpRequest): Promise<HttpResponse> => {
      const { id } = httpRequest.params as { id: string };
      // try {
      const user = await getUser(id);
      return { statusCode: 200, body: user };
      // } catch (error) {
      // return handleError(error);
      // }
    };

type UpdateUserFn = (
  id: string,
  data: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    user_type: 1 | 2;
  }
) => Promise<Partial<User>>;

export const updateUserController =
  (updateUser: UpdateUserFn) =>
    async (httpRequest: HttpRequest): Promise<HttpResponse> => {
      const { id } = httpRequest.params as { id: string };
      const { first_name, last_name, email, user_type } = httpRequest.body as {
        first_name: string;
        last_name: string;
        email: string;
        user_type: 1 | 2;
      };

      // try {
      const user = await updateUser(id, { id, first_name, last_name, email, user_type });
      return { statusCode: 200, body: user };
      // } catch (error) {
      // return handleError(error);
      // }
    };

type GetUsersFn = () => Promise<Partial<User>[]>;

export const getUsersController = (getUsers: GetUsersFn) => async (): Promise<HttpResponse> => {
  // try {
  const users = await getUsers();
  return { statusCode: 200, body: users };
  // } catch (error) {
  // return handleError(error);
  // }
};

