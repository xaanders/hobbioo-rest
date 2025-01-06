// src/controllers/user-controller.ts
import { User } from '../entities/user.js';
import { HttpRequest } from '../express-callback/index.js';
import { handleError } from './error-handler.js';

type CreateUserFn = (data: {
  first_name: string;
  last_name: string;
  email: string;
  user_type: 1 | 2;
}) => Promise<Partial<User>>;

export const createUserController =
  (createUser: CreateUserFn) => async (httpRequest: HttpRequest) => {
    const { first_name, last_name, email, user_type } = httpRequest.body;

    try {
      const user = await createUser({ first_name, last_name, email, user_type });
      if (!user) throw new Error('User not created');

      return { statusCode: 201, body: user };
    } catch (error) {
      return handleError(error);
    }
  };

type GetUserFn = (id: string) => Promise<Partial<User> | null>;

export const getUserController = (getUser: GetUserFn) => async (httpRequest: HttpRequest) => {
  const { id } = httpRequest.params;
  try {
    const user = await getUser(id);
    return { statusCode: 200, body: user };
  } catch (error) {
    return handleError(error);
  }
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
  (updateUser: UpdateUserFn) => async (httpRequest: HttpRequest) => {
    const { id } = httpRequest.params;
    const { first_name, last_name, email, user_type } = httpRequest.body;

    try {
      const user = await updateUser(id, { id, first_name, last_name, email, user_type });
      return { statusCode: 200, body: user };
    } catch (error) {
      return handleError(error);
    }
  };

type GetUsersFn = () => Promise<Partial<User>[]>;

export const getUsersController = (getUsers: GetUsersFn) => async () => {
  try {
    const users = await getUsers();
    return { statusCode: 200, body: users };
  } catch (error) {
    return handleError(error);
  }
};
