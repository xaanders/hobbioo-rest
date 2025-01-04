// src/controllers/user-controller.ts
import { Request, Response, RequestHandler } from "express";
import { UseCaseError } from "../shared/error/use-case-error.js";
import { User } from "../entities/user.js";
import { HttpRequest } from "../express-callback/index.js";
import { ValidationError } from "../shared/error/validation-error.js";
import logger from "../shared/logger/index.js";

type CreateUserFn = (data: {
  first_name: string;
  last_name: string;
  email: string;
  user_type: 1 | 2;
}) => Promise<Partial<User>>;


export const createUserController = (createUser: CreateUserFn) =>
  async (httpRequest: HttpRequest) => {
    const { first_name, last_name, email, user_type } = httpRequest.body;

    try {
      const user = await createUser({ first_name, last_name, email, user_type });
      return { statusCode: 201, body: user }
    } catch (error) {
      logger.error({ error: 'Error creating user', debug_details: error })

      if (error instanceof UseCaseError)
        return { statusCode: 400, body: { error: error.message } }
      else
        return { statusCode: 500, body: { error: "Internal server error" } }
    }
  };

type GetUserFn = (id: string) => Promise<Partial<User> | null>;

export const getUserController = (getUser: GetUserFn) =>
  async (httpRequest: HttpRequest) => {
    const { id } = httpRequest.params;
    try {
      const user = await getUser(id);
      return { statusCode: 200, body: user }
    } catch (error) {
      console.log({ error: 'Error getting user', debug_details: error })
      if (error instanceof UseCaseError)
        return { statusCode: 400, body: { error: error.message } }
      else
        return { statusCode: 500, body: { error: "Internal server error" } }
    }
  };

type UpdateUserFn = (id: string, data: {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: 1 | 2;
}) => Promise<Partial<User>>;

export const updateUserController = (updateUser: UpdateUserFn) =>
  async (httpRequest: HttpRequest) => {
    const { id } = httpRequest.params;
    const { first_name, last_name, email, user_type } = httpRequest.body;
    try {
      const user = await updateUser(id, { id, first_name, last_name, email, user_type });
      return { statusCode: 200, body: user }
    } catch (error) {
      console.log({ error: 'Error updating user', debug_details: error })
      if (error instanceof UseCaseError)
        return { statusCode: 400, body: { error: error.message } }
      else if (error instanceof ValidationError)
        return { statusCode: 400, body: { error: error.message } }
      else
        return { statusCode: 500, body: { error: "Internal server error" } }

    }
  }
