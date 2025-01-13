import { User } from "../../../entities/user.js";
import { AuthError } from "../../../shared/error/auth-error.js";
import { UseCaseError } from "../../../shared/error/use-case-error.js";
import { createUser } from "../../../use-cases/auth/create-user.js";
import { mockCognitoAuth, mockHelpers, mockUserRepository } from "../../mocks/dependencies.js";

describe("Create User Use Case", () => {
    // Mock dependencies

    const mockUserData = {
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        user_type: 1 as const,
        password: "StrongPass123!",
    };

    const mockCreatedUser = {
        user_id: "mock-user-id",
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        user_type: 1,
        status: 1,
        created_at: '2025-01-01',
        updated_at: '2025-01-01',
        toJson: jest.fn().mockReturnValue({
            user_id: "mock-user-id",
            first_name: "John",
            last_name: "Doe",
            email: "john@example.com",
            user_type: 1,
            created_at: '2025-01-01',
            updated_at: '2025-01-01',
        }),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should successfully create a user", async () => {
        // Setup mocks
        mockCognitoAuth.registerUser.mockResolvedValue({
            userId: "mock-user-id",
            success: true,
        });
        mockUserRepository.createUser.mockResolvedValue(mockCreatedUser);

        // Create use case instance
        const createUserUseCase = createUser({
            userRepository: mockUserRepository,
            helpers: mockHelpers,
            cognitoAuth: mockCognitoAuth,
        });

        // Execute use case
        const result = await createUserUseCase(mockUserData);

        // Verify results
        expect(mockHelpers.generateId).toHaveBeenCalled();
        expect(mockCognitoAuth.registerUser).toHaveBeenCalledWith({
            username: mockUserData.email,
            password: mockUserData.password,
            id: "mock-user-id",
            name: "John Doe",
        });

        expect(mockUserRepository.createUser).toHaveBeenCalledWith(
            expect.any(User)
        );

        expect(result).toEqual({
            user_id: "mock-user-id",
            first_name: "John",
            last_name: "Doe",
            email: "john@example.com",
            user_type: 1,
            created_at: '2025-01-01',
            updated_at: '2025-01-01',
        });
    });

    it("should throw AuthError when Cognito registration fails", async () => {
        // Setup mock to simulate Cognito failure
        mockCognitoAuth.registerUser.mockResolvedValue(null);

        const createUserUseCase = createUser({
            userRepository: mockUserRepository,
            helpers: mockHelpers,
            cognitoAuth: mockCognitoAuth,
        });

        // Verify error is thrown
        await expect(createUserUseCase(mockUserData)).rejects.toThrow(AuthError);
        await expect(createUserUseCase(mockUserData)).rejects.toThrow(
            "Failed to register user"
        );

        // Verify user was not created in repository
        expect(mockUserRepository.createUser).not.toHaveBeenCalled();
    });

    it("should throw UseCaseError when repository creation fails", async () => {
        // Setup mocks
        mockCognitoAuth.registerUser.mockResolvedValue({
            userId: "mock-user-id",
            success: true,
        });
        mockUserRepository.createUser.mockResolvedValue(null);

        const createUserUseCase = createUser({
            userRepository: mockUserRepository,
            helpers: mockHelpers,
            cognitoAuth: mockCognitoAuth,
        });

        // Verify error is thrown
        await expect(createUserUseCase(mockUserData)).rejects.toThrow(UseCaseError);
        await expect(createUserUseCase(mockUserData)).rejects.toThrow(
            "Failed to create user"
        );
    });

    it("should create a provider user with user_type 2", async () => {
        const providerUserData = {
            ...mockUserData,
            user_type: 2 as const,
        };

        mockCognitoAuth.registerUser.mockResolvedValue({
            userId: "mock-user-id",
            success: true,
        });
        mockUserRepository.createUser.mockResolvedValue({
            ...mockCreatedUser,
            user_type: 2,
            toJson: jest.fn().mockReturnValue({
                ...mockCreatedUser.toJson(),
                user_type: 2,
            }),
        });

        const createUserUseCase = createUser({
            userRepository: mockUserRepository,
            helpers: mockHelpers,
            cognitoAuth: mockCognitoAuth,
        });

        const result = await createUserUseCase(providerUserData);

        expect(result.user_type).toBe(2);
        expect(mockUserRepository.createUser).toHaveBeenCalledWith(
            expect.objectContaining({
                user_type: 2,
            })
        );
    });
});