// src/app/routes/userRoutes.ts
import { Router } from "express";
import {
  getUserController,
  getUsersController,
  updateUserController,
} from "../../controllers/user-controller.js";
import { getUser } from "../../use-cases/get-user.js";
import { getUsers } from "../../use-cases/get-users.js";
import { updateUser } from "../../use-cases/update-user.js";
import { makeExpressCallback } from "../../express-callback/index.js";
import { IUserRepository } from "../../gateways/user-repository.js";
import { makeAuthMiddleware } from "../auth/middleware.js";
import { ISessionManager } from "../../gateways/session-manager.js";
import { IHelpers } from "../helpers/IHelpers.js";

const makeUserRoutes = (
  userRepository: IUserRepository,
  sessionManager: ISessionManager,
  helpers: IHelpers
) => {
  const router = Router();

  // Initialize middleware
  const authMiddleware = makeAuthMiddleware(sessionManager);
  const expressCallback = makeExpressCallback(helpers);
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
  router.get("/", authMiddleware, expressCallback(getUsersHandler));
  router.get("/:id", authMiddleware, expressCallback(getUserHandler));
  router.patch("/:id", authMiddleware, expressCallback(updateUserHandler));

  return router;
};

export default makeUserRoutes;
