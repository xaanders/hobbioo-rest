import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import logger from "../logger/index.js";
import { EmailAlreadyExistsError } from "../shared/error/domain-errors.js";

import { ResourceNotFoundError } from "../shared/error/domain-errors.js";
import { ValidationError } from "../shared/error/validation-error.js";
import { prismaErrorHandler } from "../app/db/prisma-error-handler.js";

export const handleError = (error: unknown) => {
  logger.error("Error:", error);

  if (error instanceof ValidationError) {
    return { statusCode: 400, body: { error: error.message } };
  }

  if (error instanceof EmailAlreadyExistsError) {
    return { statusCode: 409, body: { error: error.message } };
  }

  if (error instanceof ResourceNotFoundError) {
    return { statusCode: 404, body: { error: error.message } };
  }

  if (error instanceof PrismaClientKnownRequestError) {
    return prismaErrorHandler(error);
  }

  return { statusCode: 500, body: { error: "Internal server error" } };
};
