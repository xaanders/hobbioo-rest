import { User } from "../../entities/user.js";
import { IUserRepository } from "../../gateways/user-repository.js";

// Temporary in-memory storage for users
export const users = new Map<string, User>();
const newUser = new User(
        "be40ef96-6a0e-49e9-88c5-96201d67d0d9",
        "shasha",
        "2",
        "a@assa.s",
        1,
        {
            sanitize: (value: string) => value,
            generateId: () => "be40ef96-6a0e-49e9-88c5-96201d67d0d9"
        }
)
users.set(newUser.id, newUser)
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

    async updateUser(id: string, data: User): Promise<User> {
            this.deleteUser(id)

            users.set(id, data);

            return data as User;
       

    }

    async deleteUser(id: string): Promise<void> {
        users.delete(id);
    }
}