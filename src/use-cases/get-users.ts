import { User } from "../entities/user.js";
import { IUserRepository } from "../gateways/user-repository.js";
import { UseCaseError } from "../shared/error/use-case-error.js";

export const getUsers =
  ({ userRepository }: { userRepository: IUserRepository }) =>
  async (): Promise<Partial<User>[]> => {
    const users = await userRepository.getUsers();
    return users.map((user) => user.toJson());
  };
