import { User } from "../entities/user.js";

export interface IUserRepository {
    createUser: (user: User) => Promise<Partial<User>>;
    getUser: (id: string) => Promise<Partial<User> | null>;
    updateUser: (id: string, user: User) => Promise<Partial<User>>;
    deleteUser: (id: string) => Promise<void>;
}
