import { AuthError } from "../../../shared/error/auth-error.js";
import { loginUser } from "../../../use-cases/auth/login-user.js";
import { mockCognitoAuth } from "../../mocks/dependencies.js";

describe("Login User Use Case", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should successfully login a user", async () => {
        const mockToken = "mock-session-token";
        mockCognitoAuth.authenticateUser.mockResolvedValue(mockToken);
        const loginUserUseCase = loginUser(mockCognitoAuth);

        const result = await loginUserUseCase("test@example.com", "password123");

        expect(result).toBe(mockToken);
        expect(mockCognitoAuth.authenticateUser).toHaveBeenCalledWith(
            "test@example.com",
            "password123"
        );
        expect(mockCognitoAuth.authenticateUser).toHaveBeenCalledTimes(1);
    });

    it("should throw AuthError when username is empty", async () => {
        const loginUserUseCase = loginUser(mockCognitoAuth);

        await expect(loginUserUseCase("", "password123"))
            .rejects.toThrow(AuthError);
        await expect(loginUserUseCase("", "password123"))
            .rejects.toThrow("Username and password are required");
        expect(mockCognitoAuth.authenticateUser).not.toHaveBeenCalled();
    });

    it("should throw AuthError when password is empty", async () => {
        const loginUserUseCase = loginUser(mockCognitoAuth);

        await expect(loginUserUseCase("test@example.com", ""))
            .rejects.toThrow(AuthError);
        await expect(loginUserUseCase("test@example.com", ""))
            .rejects.toThrow("Username and password are required");
        expect(mockCognitoAuth.authenticateUser).not.toHaveBeenCalled();
    });

    it("should throw AuthError when authentication fails", async () => {
        mockCognitoAuth.authenticateUser.mockRejectedValue(
            new AuthError("Invalid credentials")
        );
        const loginUserUseCase = loginUser(mockCognitoAuth);

        await expect(loginUserUseCase("test@example.com", "wrongpass"))
            .rejects.toThrow(AuthError);
        await expect(loginUserUseCase("test@example.com", "wrongpass"))
            .rejects.toThrow("Invalid credentials");
    });
});