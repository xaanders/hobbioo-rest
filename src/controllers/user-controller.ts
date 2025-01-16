// src/controllers/user-controller.ts
import { User } from "../entities/user.js";
import { HttpRequest, HttpResponse } from "../express/callback.js";
// import { handleError } from "./error-handler.js";

type GetUserFn = (id: string) => Promise<Partial<User> | null>;

export const getUserController =
  (getUser: GetUserFn) =>
  async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    const { id } = httpRequest.params as { id: string };
    const user = await getUser(id);
    return { statusCode: 200, body: user };
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
    const { first_name, last_name, email, user_type } = httpRequest.body

    const user = await updateUser(id, {
      id,
      first_name: first_name as string,
      last_name: last_name as string,
      email: email as string,
      user_type: user_type as 1 | 2,
    });
    return { statusCode: 200, body: user };
  };

type GetUsersFn = () => Promise<Partial<User>[]>;

export const getUsersController = (getUsers: GetUsersFn) => async (): Promise<HttpResponse> => {
  const users = await getUsers();
  return { statusCode: 200, body: users };
};
