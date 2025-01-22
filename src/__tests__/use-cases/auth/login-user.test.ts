import { User } from "../../../entities/user.js";
import { AuthError } from "../../../shared/error/auth-error.js";
import { loginUser } from "../../../use-cases/auth/login-user.js";
import {
  mockCognitoAuth,
  mockUserRepository,
  mockSessionManager,
} from "../../mocks/dependencies.js";

describe("Login User Use Case", () => {
  const mockUser = new User({
    user_id: "mock-user-id",
    first_name: "Mock",
    last_name: "User",
    email: "test@example.com",
    user_type: 1,
    status: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully login a user", async () => {
    const mockToken = "mock-session-token";
    const authUserSession = { session: {}, expiresIn: 123 };

    mockCognitoAuth.authenticateUser.mockResolvedValue(authUserSession);
    mockUserRepository.getUser.mockResolvedValue(mockUser);
    mockSessionManager.createSession.mockResolvedValue(mockToken);

    const loginUserUseCase = loginUser(mockCognitoAuth, mockSessionManager, mockUserRepository);

    const result = await loginUserUseCase("test@example.com", "password123");

    expect(result).toBe(mockToken);
    expect(mockCognitoAuth.authenticateUser).toHaveBeenCalledWith(
      "test@example.com",
      "password123"
    );
    expect(mockCognitoAuth.authenticateUser).toHaveBeenCalledTimes(1);
  });

  it("should throw AuthError when username is empty", async () => {
    const loginUserUseCase = loginUser(mockCognitoAuth, mockSessionManager, mockUserRepository);

    await expect(loginUserUseCase("", "password123")).rejects.toThrow(AuthError);
    await expect(loginUserUseCase("", "password123")).rejects.toThrow(
      "Username and password are required"
    );
    expect(mockCognitoAuth.authenticateUser).not.toHaveBeenCalled();
  });

  it("should throw AuthError when password is empty", async () => {
    const loginUserUseCase = loginUser(mockCognitoAuth, mockSessionManager, mockUserRepository);

    await expect(loginUserUseCase("test@example.com", "")).rejects.toThrow(AuthError);
    await expect(loginUserUseCase("test@example.com", "")).rejects.toThrow(
      "Username and password are required"
    );
    expect(mockCognitoAuth.authenticateUser).not.toHaveBeenCalled();
  });

  it("should throw AuthError when authentication fails", async () => {
    mockCognitoAuth.authenticateUser.mockRejectedValue(new AuthError("Invalid credentials"));
    const loginUserUseCase = loginUser(mockCognitoAuth, mockSessionManager, mockUserRepository);

    await expect(loginUserUseCase("test@example.com", "wrongpass")).rejects.toThrow(AuthError);
    await expect(loginUserUseCase("test@example.com", "wrongpass")).rejects.toThrow(
      "Invalid credentials"
    );
  });

  it("should throw AuthError when user is not found", async () => {
    const authUserSession = { session: {}, expiresIn: 123 };
    mockCognitoAuth.authenticateUser.mockResolvedValue(authUserSession);
    mockUserRepository.getUser.mockResolvedValue(null);

    const loginUserUseCase = loginUser(mockCognitoAuth, mockSessionManager, mockUserRepository);

    await expect(loginUserUseCase("test@example.com", "password123")).rejects.toThrow(AuthError);
    await expect(loginUserUseCase("test@example.com", "password123")).rejects.toThrow(
      "User not found"
    );
  });
});
