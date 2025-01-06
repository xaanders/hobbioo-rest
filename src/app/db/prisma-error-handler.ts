import { Prisma } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library.js";
import logger from "../../logger/index.js";

export const prismaErrorHandler = (error: Error) => {
  if (error instanceof PrismaClientKnownRequestError) {
    logger.error("Prisma Error:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    switch (error.code) {
      case "P2002": // Unique constraint violation
        return { statusCode: 409, body: { error: "A record with this value already exists." } };
      case "P2025": // Record not found
        return { statusCode: 404, body: { error: "Record not found." } };
      default:
        return { statusCode: 500, body: { error: "Database error occurred." } };
    }
  }
};
