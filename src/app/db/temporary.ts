import { UseCaseError } from "../../shared/error/use-case-error.js";
import { User } from "../../entities/user.js";
import { IUserRepository } from "../../gateways/user-repository.js";

// Temporary in-memory storage for users
export const users = new Map<string, User>();

// Database operations

export class InMemoryUserRepository implements IUserRepository {
    async createUser(user: User): Promise<Partial<User>> {
        users.set(user.id, user);
        return user.userToJson() as Partial<User>;
    }

    async getUser(id: string): Promise<Partial<User> | null> {
        const user = users.get(id);
        if (!user) {
            throw new UseCaseError('User not found');
        }
        return user.userToJson() as Partial<User>;
    }

    async updateUser(id: string, user: Partial<User>): Promise<Partial<User>> {
        const existingUser = users.get(id);
        if (!existingUser) {
            throw new UseCaseError('User not found');
        }
    
        const updatedUser = {
            ...existingUser,
            ...user,
        };
    
        users.set(id, updatedUser as User);
        const newUser = updatedUser as User
    
        return newUser.userToJson() as Partial<User>;
    }
    
    async deleteUser(id: string): Promise<void> {
        users.delete(id);
    }
}