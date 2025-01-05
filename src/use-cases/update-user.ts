import { IHelpers } from "../shared/interfaces.js";
import { User } from "../entities/user.js";
import { IUserRepository } from "../gateways/user-repository.js";
import { UseCaseError } from "../shared/error/use-case-error.js";

export const updateUser = ({ userRepository, helpers }: { userRepository: IUserRepository, helpers: IHelpers }) => {
    return async (id: string, data: Partial<User>): Promise<Partial<User>> => {

        const updatedUser = await userRepository.updateUser(id, data as User);
        
        if (!updatedUser)
            throw new UseCaseError('Could not update user');

        return updatedUser.toJson();
    }
}