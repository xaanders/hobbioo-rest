import { User } from "../../entities/user.js";
import { IUserRepository } from "../../gateways/user-repository.js";

// Temporary in-memory storage for users
export const users = new Map<string, User>();

// Database operations

export class InMemoryUserRepository implements IUserRepository {
  createUser(user: User): Promise<User> {
    users.set(user.user_id, user);
    return Promise.resolve(user);
  }

  getUser(id: string): Promise<User | null> {
    const user = users.get(id);

    return Promise.resolve(user ?? null);
  }

  updateUser(id: string, data: Partial<User>): Promise<User> {
    const existingUser = users.get(id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    const updatedUser = Object.assign(existingUser, data);

    return Promise.resolve(updatedUser);
  }

  deleteUser(id: string): Promise<void> {
    users.delete(id);

    return Promise.resolve();
  }

  getUsers(): Promise<User[]> {
    return Promise.resolve(Array.from(users.values()));
  }
}
