import { IHelpers } from "../app/helpers/IHelpers.js";
import { User } from "../entities/user.js";
import { IUserRepository } from "../gateways/user-repository.js";
import { UseCaseError } from "../shared/error/use-case-error.js";

export const updateUser = ({
  userRepository,
  helpers,
}: {
  userRepository: IUserRepository;
  helpers: IHelpers;
}) => {
  return async (id: string, data: Partial<User>): Promise<Partial<User>> => {
    const user = new User(null, helpers);
    const sanitizedAndValidatedData = user.beforeUpdate(data, helpers);

    const updatedUser = await userRepository.updateUser(id, sanitizedAndValidatedData as User);

    if (!updatedUser) throw new UseCaseError("Could not update user");

    return updatedUser.toJson();
  };
};
