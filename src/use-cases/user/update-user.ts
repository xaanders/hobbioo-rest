import { IHelpers } from "../../app/helpers/IHelpers.js";
import { User } from "../../entities/user.js";
import { IUserRepository } from "../../gateways/user-repository.js";
import { UseCaseError } from "../../shared/error/use-case-error.js";

export const updateUser = ({
  userRepository,
  helpers,
}: {
  userRepository: IUserRepository;
  helpers: IHelpers;
}) => {
  return async (id: string, data: Partial<User>): Promise<Partial<User>> => {
    
    const user = new User({
      user_id: id,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      user_type: data.user_type,
      status: data.status,
      created_at: data.created_at,
      updated_at: data.updated_at,
    });
    
    const upd = user.beforeUpdate(helpers);

    const updatedUser = await userRepository.updateUser(id, upd as User);

    if (!updatedUser) throw new UseCaseError("Could not update user");

    return updatedUser.toJson();
  };
};
