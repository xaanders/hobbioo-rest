import { IHelpers } from "@/shared/interfaces.js";
import { User } from "../entities/user.js";
import { IUserRepository } from "../gateways/user-repository.js";
import { UseCaseError } from "../shared/error/use-case-error.js";

export const updateUser = ({ userRepository, helpers }: { userRepository: IUserRepository, helpers: IHelpers }) => {
    return async (id: string, data: Partial<User>): Promise<Partial<User>> => {
        const user = await userRepository.getUser(id);
        if (!user) throw new UseCaseError('User not found');

        user.update(data, helpers)

        const updatedUser = await userRepository.updateUser(id, user);
        
        if (!updatedUser) {
            console.log({
                error: 'Could not update user',
                timestamp: new Date().toISOString(),
                debug_details: JSON.stringify({ id, data, updatedUser })
            });
            throw new UseCaseError('Could not update user');
        }

        return updatedUser;
    }
}