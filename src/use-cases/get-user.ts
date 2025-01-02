// src/useCases/getUser.ts
import { UseCaseError } from "../shared/error/use-case-error.js";
import { User } from "../entities/user.js";
import { IUserRepository } from "../gateways/user-repository.js";

export const getUser = ({ userRepository }: { userRepository: IUserRepository }) =>
  async (id: string): Promise<Partial<User> | null> => {
    const user = await userRepository.getUser(id);
    if (!user) {
      throw new UseCaseError("User not found");
    }
    return user;
  }


