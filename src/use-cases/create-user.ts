// src/useCases/createUser.ts
import { User } from "../entities/user.js";
import { IHelpers } from "../shared/interfaces.js";
import { ValidationError } from "../shared/error/validation-error.js";
import { UseCaseError } from "../shared/error/use-case-error.js";
import { IUserRepository } from "../gateways/user-repository.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

type CreateUserDTO = {
  first_name: string;
  last_name: string;
  email: string;
  user_type: 1 | 2;
};

export const createUser =
  ({ userRepository, helpers }: { userRepository: IUserRepository; helpers: IHelpers }) =>
  async (userData: CreateUserDTO) => {
    const id = helpers.generateId();
    const user = new User(
      {
        id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        user_type: userData.user_type,
        status: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      helpers
    );

    const createdUser = await userRepository.createUser(user);

    if (!createdUser) throw new UseCaseError("Failed to create user");

    return createdUser.toJson();
  };
