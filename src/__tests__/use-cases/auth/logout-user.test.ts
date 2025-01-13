import { AuthError } from "../../../shared/error/auth-error.js";
import { logoutUser } from "../../../use-cases/auth/logout-user.js";
import { mockCognitoAuth } from "../../mocks/dependencies.js";

describe("Logout User Use Case", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should successfully logout a user", async () => {
        mockCognitoAuth.logoutUser.mockResolvedValue(undefined);
        const logoutUserUseCase = logoutUser(mockCognitoAuth);

        await logoutUserUseCase("valid-session-id");

        expect(mockCognitoAuth.logoutUser).toHaveBeenCalledWith("valid-session-id");
        expect(mockCognitoAuth.logoutUser).toHaveBeenCalledTimes(1);
        
    });

    it("should throw AuthError when session ID is empty", async () => {
        const logoutUserUseCase = logoutUser(mockCognitoAuth);

        await expect(logoutUserUseCase(""))
            .rejects.toThrow(AuthError);
        await expect(logoutUserUseCase(""))
            .rejects.toThrow("Session ID is required");
        expect(mockCognitoAuth.logoutUser).not.toHaveBeenCalled();
    });

    it("should throw AuthError when logout fails", async () => {
        mockCognitoAuth.logoutUser.mockRejectedValue(
            new AuthError("Failed to logout")
        );
        const logoutUserUseCase = logoutUser(mockCognitoAuth);

        await expect(logoutUserUseCase("valid-session-id"))
            .rejects.toThrow(AuthError);
        await expect(logoutUserUseCase("valid-session-id"))
            .rejects.toThrow("Failed to logout");
    });
});
