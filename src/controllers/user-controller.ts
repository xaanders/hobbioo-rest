// src/controllers/user-controller.ts
import { Request, Response, RequestHandler } from "express";
import { UseCaseError } from "../shared/error/use-case-error.js";
import { User } from "../entities/user.js";

type CreateUserFn = (data: {
  first_name: string;
  last_name: string;
  email: string;
  user_type: 1 | 2;
}) => Promise<Partial<User>>;


export const createUserController = (createUser: CreateUserFn): RequestHandler =>
  async (req: Request, res: Response) => {
    const { first_name, last_name, email, user_type } = req.body;

    try {
      const user = await createUser({ first_name, last_name, email, user_type });
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof UseCaseError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  };

type GetUserFn = (id: string) => Promise<Partial<User> | null>;

export const getUserController = (getUser: GetUserFn): RequestHandler =>
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const user = await getUser(id);
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof UseCaseError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  };

type UpdateUserFn = (id: string, data: {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: 1 | 2;
}) => Promise<Partial<User>>;

export const updateUserController = (updateUser: UpdateUserFn): RequestHandler =>
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { first_name, last_name, email, user_type } = req.body;
    try {
      const user = await updateUser(id, { id, first_name, last_name, email, user_type });
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof UseCaseError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }
