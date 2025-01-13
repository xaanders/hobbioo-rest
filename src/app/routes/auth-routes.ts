import { NextFunction, Router, Request, Response } from "express";
import { ICognitoAuth } from "../auth/cognito-service.js";
import { makeExpressCallback } from "../../express/callback.js";

import { loginController, registerUserController, confirmUserEmailController, logoutController } from "../../controllers/auth-controller.js";

import { loginUser } from "../../use-cases/auth/login-user.js";
import { createUser } from "../../use-cases/auth/create-user.js";
import { confirmUserEmail } from "../../use-cases/auth/confirm-user.js";
import { logoutUser } from "../../use-cases/auth/logout-user.js";

import { IUserRepository } from "../../gateways/user-repository.js";
import { IHelpers } from "../helpers/IHelpers.js";

const makeAuthRoutes = (
  cognitoAuth: ICognitoAuth,
  userRepository: IUserRepository,
  helpers: IHelpers,
  rateLimitMiddleware: (req: Request, res: Response, next: NextFunction) => void,
  authMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  const router = Router();
  const expressCallback = makeExpressCallback(helpers);

  //initialize use cases
  const loginUserFlow = loginUser(cognitoAuth);
  const createUserFlow = createUser({ userRepository, helpers, cognitoAuth });
  const confirmUserEmailFlow = confirmUserEmail(cognitoAuth);
  const logoutUserFlow = logoutUser(cognitoAuth);
  //initialize controllers
  const loginUserHandler = loginController(loginUserFlow, helpers);
  const registerUserHandler = registerUserController(createUserFlow, helpers);
  const confirmUserEmailHandler = confirmUserEmailController(confirmUserEmailFlow, helpers);
  const logoutUserHandler = logoutController(logoutUserFlow);

  //register routes
  router.post("/login", rateLimitMiddleware, expressCallback(loginUserHandler));
  router.post("/register", rateLimitMiddleware, expressCallback(registerUserHandler));
  router.get("/logout", rateLimitMiddleware, authMiddleware, expressCallback(logoutUserHandler));
  router.get("/confirm-email", rateLimitMiddleware, expressCallback(confirmUserEmailHandler));

  return router;
};

export default makeAuthRoutes;
