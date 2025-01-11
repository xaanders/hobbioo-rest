import { Router } from "express";
import { ICognitoAuth } from "../auth/cognito-service.js";
import { makeExpressCallback } from "../../express/callback.js";

import { loginController, registerUserController, confirmUserEmailController } from "../../controllers/auth-controller.js";

import { loginUser } from "../../use-cases/login-user.js";
import { createUser } from "../../use-cases/create-user.js";

import { IUserRepository } from "../../gateways/user-repository.js";
import { IHelpers } from "../helpers/IHelpers.js";
import { confirmUserEmail } from "../../use-cases/confirm-user.js";

const makeAuthRoutes = (
  cognitoAuth: ICognitoAuth,
  userRepository: IUserRepository,
  helpers: IHelpers
) => {
  const router = Router();

  const expressCallback = makeExpressCallback(helpers);

  //initialize use cases
  const loginUserFlow = loginUser(cognitoAuth);
  const createUserFlow = createUser({ userRepository, helpers, cognitoAuth });
  const confirmUserEmailFlow = confirmUserEmail(cognitoAuth);

  //initialize controllers
  const loginUserHandler = loginController(loginUserFlow, helpers);
  const registerUserHandler = registerUserController(createUserFlow, helpers);
  const confirmUserEmailHandler = confirmUserEmailController(confirmUserEmailFlow, helpers);

  //register routes
  router.post("/login", expressCallback(loginUserHandler));
  router.post("/register", expressCallback(registerUserHandler));
  // router.post("/logout", expressCallback(logoutController));
  router.get("/confirm-email", expressCallback(confirmUserEmailHandler));

  return router;
};

export default makeAuthRoutes;
