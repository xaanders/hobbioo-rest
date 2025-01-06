import { User } from '../entities/user.js';

export interface IUserRepository {
  createUser: (user: User) => Promise<User>;
  getUser: (id: string) => Promise<User | null>;
  updateUser: (id: string, data: User) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  getUsers: () => Promise<User[]>;
}
