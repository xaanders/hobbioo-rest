import { Router } from "express";
import { ICognitoAuth } from "../auth/cognito-service.js";
import { makeExpressCallback } from "../../express-callback/index.js";
import { loginController } from "../../controllers/auth-controller.js";
import { loginUser } from "../../use-cases/login-user.js";

const makeAuthRoutes = (cognitoAuth: ICognitoAuth) => {
  const router = Router();

  const loginUserFlow = loginUser(cognitoAuth);
  const loginHandler = loginController(loginUserFlow);

  router.post("/login", makeExpressCallback(loginHandler));

  return router;
};

export default makeAuthRoutes; 