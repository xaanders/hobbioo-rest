import { PrismaClient } from "@prisma/client";
import { IPrismaRepository } from "../../gateways/prisma-repository.js";

type SqlParameter = string | number | boolean | Date | null;

export const initPrismaExecutable = (prisma: PrismaClient): IPrismaRepository => {
  const executeSelect = async <T>(query: string, params?: SqlParameter[]): Promise<T[]> => {
    const result = await prisma.$queryRawUnsafe<T[]>(query, ...(params || []));
    return result;
  };

  const executeUpdate = async (query: string, params?: SqlParameter[]): Promise<number> => {
    const result = await prisma.$executeRawUnsafe(query, ...(params || []));
    return result;
  };

  const executeInsert = async <T>(query: string, params?: SqlParameter[]): Promise<T> => {
    const result = await prisma.$queryRawUnsafe<T[]>(query, ...(params || []));
    return result[0];
  };

  return {
    executeSelect,
    executeUpdate,
    executeInsert,
  };
};
