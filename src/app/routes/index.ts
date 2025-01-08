/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import makeUserRoutes from "./user-routes.js";
import makeAuthRoutes from "./auth-routes.js";
import { createPrismaUserRepository } from "../db/prisma-user-repository.js";
import { InMemorySessionManager } from '../auth/session-manager.js';
import { createCognitoAuth } from '../auth/cognito-service.js';

export const createRouter = () => {
  const router = Router();
  const prisma = new PrismaClient({
    log: ["error", "warn"],
  });

  // Initialize auth dependencies
  const sessionManager = new InMemorySessionManager();
  const cognitoClient = new CognitoIdentityProvider({
    region: process.env.AWS_REGION
  });
  
  const cognitoAuth = createCognitoAuth(
    cognitoClient,
    sessionManager,
    process.env.COGNITO_USER_POOL_ID!,
    process.env.COGNITO_CLIENT_ID!
  );

  // Initialize repositories
  const userRepository = createPrismaUserRepository(prisma);

  // Initialize routes
  const userRoutes = makeUserRoutes(userRepository, sessionManager);
  const authRoutes = makeAuthRoutes(cognitoAuth);

  // Register routes
  router.use("/auth", authRoutes);
  router.use("/users", userRoutes);

  return { router, prisma };
};
