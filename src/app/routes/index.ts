import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import makeUserRoutes from './user-routes.js';
import { createPrismaUserRepository } from '../db/prisma-user-repository.js';

export const createRouter = () => {
  const router = Router();
  const prisma = new PrismaClient({
    log: ['error', 'warn']
  });

  // Initialize repositories
  const userRepository = createPrismaUserRepository(prisma);

  const userRoutes = makeUserRoutes(userRepository);
  
  // Register routes
  router.use('/users', userRoutes);

  return { router, prisma };
}; 