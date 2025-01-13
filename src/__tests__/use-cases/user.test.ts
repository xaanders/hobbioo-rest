import { getUser } from "../../use-cases/user/get-user.js";
import { getUsers } from "../../use-cases/user/get-users.js";
import { updateUser } from "../../use-cases/user/update-user.js";
import { UseCaseError } from "../../shared/error/use-case-error.js";
import { User } from "../../entities/user.js";
import { IHelpers } from "../../app/helpers/IHelpers.js";

describe("User Use Cases", () => {
  // Mock dependencies
  const mockUser = {
    user_id: "123",
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    toJson: jest.fn().mockReturnValue({
        user_id: "123",
      name: "John Doe",
      email: "john@example.com",
    }),
  };

  const mockUserRepository = {
    getUser: jest.fn(),
    getUsers: jest.fn(),
    updateUser: jest.fn(),
    createUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  const mockHelpers: IHelpers = {
    sanitize: jest.fn((input: string) => input.trim()),
    generateId: jest.fn(() => "123"),
    logger: jest.fn(),
    isProductionData: jest.fn(() => false),
    getSettings: jest.fn(() => ({
      rateLimit: {
        maxRequests: 1000,
        timeWindowSec: 60000,
        ipWhitelist: [],
      },
    })),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUser", () => {
    it("should return a user when found", async () => {
      mockUserRepository.getUser.mockResolvedValue(mockUser);
      const getUserUseCase = getUser({ userRepository: mockUserRepository });

      const result = await getUserUseCase("123");

      expect(mockUserRepository.getUser).toHaveBeenCalledWith("123");
      expect(result).toEqual({
        user_id: "123",
        name: "John Doe",
        email: "john@example.com",
      });
    });

    it("should throw UseCaseError when user is not found", async () => {
      mockUserRepository.getUser.mockResolvedValue(null);
      const getUserUseCase = getUser({ userRepository: mockUserRepository });

      await expect(getUserUseCase("123")).rejects.toThrow(UseCaseError);
      await expect(getUserUseCase("123")).rejects.toThrow("User not found");
    });
  });

  describe("getUsers", () => {
    it("should return all users", async () => {
      const mockUsers = [mockUser, { ...mockUser, user_id: "456" }];
      mockUserRepository.getUsers.mockResolvedValue(mockUsers);
      const getUsersUseCase = getUsers({ userRepository: mockUserRepository });

      const result = await getUsersUseCase();

      expect(mockUserRepository.getUsers).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(mockUser.toJson).toHaveBeenCalledTimes(2);
    });
  });

  describe("updateUser", () => {
    const updateData: Partial<User> = {
      first_name: "Jane",
      last_name: "Doe",
      email: "jane@example.com",
    };

    it("should successfully update a user", async () => {
      const updatedMockUser = {
        ...mockUser,
        ...updateData,
        toJson: jest.fn().mockReturnValue({
          user_id: "123",
          ...updateData,
        }),
      };

      mockUserRepository.updateUser.mockResolvedValue(updatedMockUser);

      const updateUserUseCase = updateUser({
        userRepository: mockUserRepository,
        helpers: mockHelpers,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await updateUserUseCase("123", updateData);

      expect(result).toEqual({
        user_id: "123",
        first_name: "Jane",
        last_name: "Doe",
        email: "jane@example.com",
      });
    });

    it("should throw UseCaseError when update fails", async () => {
      mockUserRepository.updateUser.mockResolvedValue(null);
      const updateUserUseCase = updateUser({
        userRepository: mockUserRepository,
        helpers: mockHelpers,
      });

      await expect(updateUserUseCase("123", updateData)).rejects.toThrow(UseCaseError);
      await expect(updateUserUseCase("123", updateData)).rejects.toThrow(
        "Could not update user"
      );
    });
  });
});
