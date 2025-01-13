import { AuthError } from "../../../shared/error/auth-error.js";
import { ValidationError } from "../../../shared/error/validation-error.js";
import { confirmUserEmail } from "../../../use-cases/auth/confirm-user.js";
import { mockCognitoAuth } from "../../mocks/dependencies.js";

describe("Confirm User Email Use Case", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully confirm user email", async () => {
    mockCognitoAuth.confirmEmail.mockResolvedValue({
      $metadata: { httpStatusCode: 200 },
    });
    const confirmEmailUseCase = confirmUserEmail(mockCognitoAuth);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await confirmEmailUseCase("test@example.com", "123456");

    expect(result).toEqual({ message: "Email successfully confirmed" });
    expect(mockCognitoAuth.confirmEmail).toHaveBeenCalledWith("test@example.com", "123456");
    expect(mockCognitoAuth.confirmEmail).toHaveBeenCalledTimes(1);
  });

  it("should throw ValidationError when username is empty", async () => {
    const confirmEmailUseCase = confirmUserEmail(mockCognitoAuth);

    await expect(confirmEmailUseCase("", "123456")).rejects.toThrow(ValidationError);
    await expect(confirmEmailUseCase("", "123456")).rejects.toThrow(
      "Username and code are required"
    );
    expect(mockCognitoAuth.confirmEmail).not.toHaveBeenCalled();
  });

  it("should throw ValidationError when code is empty", async () => {
    const confirmEmailUseCase = confirmUserEmail(mockCognitoAuth);

    await expect(confirmEmailUseCase("test@example.com", "")).rejects.toThrow(ValidationError);
    await expect(confirmEmailUseCase("test@example.com", "")).rejects.toThrow(
      "Username and code are required"
    );
    expect(mockCognitoAuth.confirmEmail).not.toHaveBeenCalled();
  });

  it("should throw AuthError when confirmation fails", async () => {
    mockCognitoAuth.confirmEmail.mockResolvedValue({
      $metadata: { httpStatusCode: 400 },
    });
    const confirmEmailUseCase = confirmUserEmail(mockCognitoAuth);

    await expect(confirmEmailUseCase("test@example.com", "123456")).rejects.toThrow(AuthError);
    expect(mockCognitoAuth.confirmEmail).toHaveBeenCalledTimes(1);
  });
});
