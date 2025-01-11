import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { EmailAlreadyExistsError } from "../shared/error/domain-errors.js";

import { ResourceNotFoundError } from "../shared/error/domain-errors.js";
import { ValidationError } from "../shared/error/validation-error.js";
import { prismaErrorHandler } from "../app/db/prisma-error-handler.js";
import { HttpResponse } from "./callback.js";
import { AuthError } from "../shared/error/auth-error.js";

export const handleError = (error: unknown): HttpResponse => {
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

  return { statusCode: 500, body: { error: "Internal server error" } };
};

export const handleAuthError = (error: unknown): HttpResponse | undefined => {

  if (error instanceof AuthError) {
    return { statusCode: 401, body: { error: error.message } };
  }
  // login
  if (error instanceof Error && error.name === "NotAuthorizedException") {
    return { statusCode: 401, body: { error: "Invalid username or password" } };
  }

  if (error instanceof Error && error.name === "UserNotFoundException") {
    return { statusCode: 401, body: { error: "Invalid username or password" } };
  }

  if (error instanceof Error && error.name === "UserNotConfirmedException") {
    return { statusCode: 403, body: { error: "User is not confirmed" } };
  }

  // register
  if (error instanceof Error && error.name === "UsernameExistsException") {
    return { statusCode: 409, body: { error: "Username already exists" } };
  }

  if (error instanceof Error && error.name === "InvalidPasswordException") {
    return { statusCode: 400, body: { error: "Password is invalid" } };
  }

  if (error instanceof Error && error.name === "InvalidParameterException") {
    return { statusCode: 400, body: { error: "Invalid parameter" } };
  }

  if (error instanceof Error && error.name === "LimitExceededException") {
    return { statusCode: 400, body: { error: "Limit exceeded" } };
  }
  // email confirmation
  if(error instanceof Error && error.name === "CodeMismatchException") {
    return { statusCode: 400, body: { error: "Code mismatch" } };
  }

  if(error instanceof Error && error.name === "ExpiredCodeException") {
    return { statusCode: 400, body: { error: error.message } };
  }



  if (error instanceof AuthError) {
    return { statusCode: 401, body: { error: error.message } };
  }

};
