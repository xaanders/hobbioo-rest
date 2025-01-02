import { User } from "../../entities/user.js";
import { IUserRepository } from "../../gateways/user-repository.js";

// Temporary in-memory storage for users
export const users = new Map<string, User>();

// Database operations

export class InMemoryUserRepository implements IUserRepository {
    async createUser(user: User): Promise<User> {
        users.set(user.id, user);
        return user;
    }

    async getUser(id: string): Promise<User | null> {
        const user = users.get(id);
        
        return user ?? null;
    }

    async updateUser(id: string, data: Partial<User>): Promise<User> {
        const existingUser = users.get(id);
    
        const updatedUser = {
            ...existingUser,
            ...data,
        };
    
        users.set(id, updatedUser as User);
        
        return updatedUser as User;
    }
    
    async deleteUser(id: string): Promise<void> {
        users.delete(id);
    }
}