import { User } from "../../entities/user.js";
import { IUserRepository } from "../../gateways/user-repository.js";

export const getUsers =
  ({ userRepository }: { userRepository: IUserRepository }) =>
  async (): Promise<Partial<User>[]> => {
    // TODO: RESTRICT ONLY TO ADMIN
    const users = await userRepository.getUsers();
    return users.map((user) => user.toJson());
  };
