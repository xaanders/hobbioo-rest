import { Router } from "express";
import { ICognitoAuth } from "../auth/cognito-service.js";
import { makeExpressCallback } from "../../express/callback.js";

import { loginController, registerUserController, confirmUserEmailController, logoutController } from "../../controllers/auth-controller.js";

import { loginUser } from "../../use-cases/login-user.js";
import { createUser } from "../../use-cases/create-user.js";

import { IUserRepository } from "../../gateways/user-repository.js";
import { IHelpers } from "../helpers/IHelpers.js";
import { confirmUserEmail } from "../../use-cases/confirm-user.js";
import { logoutUser } from "../../use-cases/logout-user.js";
import { makeAuthMiddleware } from "../auth/middleware.js";
import { ISessionManager } from "../../gateways/session-manager.js";

const makeAuthRoutes = (
  cognitoAuth: ICognitoAuth,
  userRepository: IUserRepository,
  helpers: IHelpers,
  sessionManager: ISessionManager
) => {
  const router = Router();
  const authMiddleware = makeAuthMiddleware(sessionManager);

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
  router.post("/login", expressCallback(loginUserHandler));
  router.post("/register", expressCallback(registerUserHandler));
  router.get("/logout", authMiddleware, expressCallback(logoutUserHandler));
  router.get("/confirm-email", expressCallback(confirmUserEmailHandler));

  return router;
};

export default makeAuthRoutes;
