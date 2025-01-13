import { ICognitoAuth } from "../../app/auth/cognito-service.js";
import { AuthError } from "../../shared/error/auth-error.js";
import { ValidationError } from "../../shared/error/validation-error.js";

export const confirmUserEmail =
  (cognitoAuth: ICognitoAuth) =>
  async (username: string, code: string): Promise<any> => {
    if (!username || !code) {
      throw new ValidationError("Username and code are required");
    }

    const response = await cognitoAuth.confirmEmail(username, code);

    if (response.$metadata.httpStatusCode !== 200)
      throw new AuthError("Could not confirm email", JSON.stringify(response));

    return { message: "Email successfully confirmed" };
  };
