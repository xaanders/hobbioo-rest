import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";
import makeUserRoutes from "./user-routes.js";
import makeAuthRoutes from "./auth-routes.js";
import { createPrismaUserRepository } from "../db/prisma-user-repository.js";
import { InMemorySessionManager } from "../auth/session-manager.js";
import { createCognitoAuth } from "../auth/cognito-service.js";
import { helpers } from "../helpers/helpers.js";
import makeAuthMiddleware from "../auth/middleware.js";
import makeRateLimitMiddleware from "../rate-limiter/middleware.js";

export const createRouter = () => {
  const router = Router();
  const prisma = new PrismaClient({
    log: ["error", "warn"],
  });

  // Initialize auth dependencies
  const sessionManager = new InMemorySessionManager();
  const cognitoClient = new CognitoIdentityProvider({
    region: process.env.AWS_REGION,
  });

  const cognitoAuth = createCognitoAuth(
    cognitoClient,
    sessionManager,
    process.env.COGNITO_USER_POOL_ID!,
    process.env.COGNITO_CLIENT_ID!
  );

  // Initialize repositories
  const userRepository = createPrismaUserRepository(prisma);

  const authMiddleware = makeAuthMiddleware(sessionManager);
  const rateLimitMiddleware = makeRateLimitMiddleware(helpers);

  // Initialize routes
  const userRoutes = makeUserRoutes(userRepository, helpers, rateLimitMiddleware, authMiddleware);
  const authRoutes = makeAuthRoutes(
    cognitoAuth,
    userRepository,
    helpers,
    rateLimitMiddleware,
    authMiddleware
  );

  // Register routes
  router.use("/auth", authRoutes);
  router.use("/users", userRoutes);

  return { router, prisma };
};
