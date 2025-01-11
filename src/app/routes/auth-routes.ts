import { Router } from "express";
import { ICognitoAuth } from "../auth/cognito-service.js";
import { makeExpressCallback } from "../../express-callback/index.js";

import { loginController, registerUserController } from "../../controllers/auth-controller.js";

import { loginUser } from "../../use-cases/login-user.js";
import { createUser } from "../../use-cases/create-user.js";

import { IUserRepository } from "../../gateways/user-repository.js";
import { IHelpers } from "../../shared/interfaces.js";

const makeAuthRoutes = (
  cognitoAuth: ICognitoAuth,
  userRepository: IUserRepository,
  helpers: IHelpers
) => {
  const router = Router();

  const expressCallback = makeExpressCallback(helpers);

  //initialize use cases
  const loginUserFlow = loginUser(cognitoAuth);
  const createUserFlow = createUser({ userRepository, helpers });

  //initialize controllers
  const loginUserHandler = loginController(loginUserFlow);
  const registerUserHandler = registerUserController(createUserFlow, cognitoAuth);

  //register routes
  router.post("/login", expressCallback(loginUserHandler));
  router.post("/register", expressCallback(registerUserHandler));

  return router;
};

export default makeAuthRoutes;
