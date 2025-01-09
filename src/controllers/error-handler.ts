import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import logger from "../logger/index.js";
import { EmailAlreadyExistsError } from "../shared/error/domain-errors.js";

import { ResourceNotFoundError } from "../shared/error/domain-errors.js";
import { ValidationError } from "../shared/error/validation-error.js";
import { prismaErrorHandler } from "../app/db/prisma-error-handler.js";
import { HttpResponse } from "../express-callback/index.js";
import { AuthError } from "../shared/error/auth-error.js";

export const handleError = (error: unknown): HttpResponse => {
  logger.error("Error:", error); // TODO: limit error logging

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
    return prismaErrorHandler(error) as HttpResponse;
  }

  if (error instanceof AuthError) {
    return { statusCode: 401, body: { error: error.message } };
  }

  return { statusCode: 500, body: { error: "Internal server error" } };
};

export const handleAuthError = (error: unknown): HttpResponse => {
  logger.error("Auth Error:", error); // TODO: limit error logging
  if (error instanceof Error && error.name === "NotAuthorizedException") {
    return { statusCode: 401, body: { error: "Invalid username or password" } };
  }

  if (error instanceof Error && error.name === "UserNotFoundException") {
    return { statusCode: 401, body: { error: "Invalid username or password" } };
  }

  if (error instanceof Error && error.name === "UserNotConfirmedException") {
    return { statusCode: 403, body: { error: "User is not confirmed" } };
  }

  if (error instanceof AuthError) {
    return { statusCode: 401, body: { error: error.message, debug: error.debug } };
  }

  return { statusCode: 500, body: { error: "Internal server error" } };
};