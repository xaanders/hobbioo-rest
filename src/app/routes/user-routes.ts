// src/app/routes/userRoutes.ts
import { NextFunction, Router, Request, Response } from "express";
import {
  getUserController,
  getUsersController,
  updateUserController,
} from "../../controllers/user-controller.js";
import { getUser } from "../../use-cases/user/get-user.js";
import { getUsers } from "../../use-cases/user/get-users.js";
import { updateUser } from "../../use-cases/user/update-user.js";
import { CallbackType } from "../../express/callback.js";
import { IUserRepository } from "../../gateways/user-repository.js";
import { IHelpers } from "../helpers/IHelpers.js";

const makeUserRoutes = (
  userRepository: IUserRepository,
  helpers: IHelpers,
  rateLimitMiddleware: (req: Request, res: Response, next: NextFunction) => void,
  authMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>,
  expressCallback: CallbackType
) => {
  const router = Router();

  // Compose the use cases
  // const createUserFlow = createUser({ userRepository, helpers });
  const getUserFlow = getUser({ userRepository });
  const getUsersFlow = getUsers({ userRepository });
  const updateUserFlow = updateUser({ userRepository, helpers });

  // Initialize controllers
  // const createUserHandler = createUserController(createUserFlow);
  const getUserHandler = getUserController(getUserFlow);
  const getUsersHandler = getUsersController(getUsersFlow);
  const updateUserHandler = updateUserController(updateUserFlow);

  // Public routes
  // router.post("/", makeExpressCallback(createUserHandler));

  // Protected routes - apply middleware
  router.get("/", authMiddleware, rateLimitMiddleware, expressCallback(getUsersHandler));
  router.get("/:id", authMiddleware, rateLimitMiddleware, expressCallback(getUserHandler));
  router.patch("/", authMiddleware, rateLimitMiddleware, expressCallback(updateUserHandler));

  return router;
};

export default makeUserRoutes;
