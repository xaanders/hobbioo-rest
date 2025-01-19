// src/useCases/createUser.ts
import { User } from "../../entities/user.js";
import { IHelpers } from "../../app/helpers/IHelpers.js";
import { UseCaseError } from "../../shared/error/use-case-error.js";
import { IUserRepository } from "../../gateways/user-repository.js";
import { ICognitoAuth } from "../../app/auth/interfaces.js";
import { AuthError } from "../../shared/error/auth-error.js";

type CreateUserDTO = {
  first_name: string;
  last_name: string;
  email: string;
  user_type: 1 | 2;
  password: string;
};

export const createUser =
  ({
    userRepository,
    helpers,
    cognitoAuth,
  }: {
    userRepository: IUserRepository;
    helpers: IHelpers;
    cognitoAuth: ICognitoAuth;
  }) =>
  async (userData: CreateUserDTO) => {
    const id = helpers.generateId();
    const user = new User(
      {
        user_id: id,
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

    const cognitoUser = await cognitoAuth.registerUser({
      username: user.email,
      password: userData.password,
      id: user.user_id,
      name: `${user.first_name} ${user.last_name}`,
    });

    if (!cognitoUser) throw new AuthError("Failed to register user", JSON.stringify(cognitoUser));

    const createdUser = await userRepository.createUser(user);

    if (!createdUser) throw new UseCaseError("Failed to create user");

    return createdUser.toJson();
  };
