import { PrismaClient } from "@prisma/client";
import { IUserRepository } from "../../gateways/user-repository.js";
import { User } from "../../entities/user.js";
import { helpers } from "../helpers/helpers.js";

const createPrismaUserRepository = (prisma: PrismaClient): IUserRepository => ({
  async createUser(user: User): Promise<User> {
    const createdUser = await prisma.user.create({
      data: {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        user_type: user.user_type,
        status: user.status,
        created_at: new Date(user.created_at).toISOString(),
        updated_at: new Date(user.updated_at).toISOString(),
      },
    });

    return new User(
      {
        user_id: createdUser.user_id,
        first_name: createdUser.first_name,
        last_name: createdUser.last_name,
        email: createdUser.email,
        user_type: createdUser.user_type as 1 | 2,
        status: createdUser.status as 0 | 1,
        created_at: createdUser.created_at.toISOString(),
        updated_at: createdUser.updated_at.toISOString(),
      },
      helpers
    );
  },

  async getUser(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { user_id: id },
    });

    return user
      ? new User(
        {
          user_id: user.user_id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          user_type: user.user_type as 1 | 2,
          status: user.status as 0 | 1,
          created_at: user.created_at.toISOString(),
          updated_at: user.updated_at.toISOString(),
        },
        helpers
      )
      : null;
  },

  async updateUser(id: string, data: User): Promise<User> {
    const updatedUser = await prisma.user.update({
      where: { user_id: id },
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        user_type: data.user_type,
        status: data.status,
        updated_at: new Date(),
      },
    });

    return new User(
      {
        user_id: updatedUser.user_id,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        email: updatedUser.email,
        user_type: updatedUser.user_type as 1 | 2,
        status: updatedUser.status as 0 | 1,
        created_at: updatedUser.created_at.toISOString(),
        updated_at: updatedUser.updated_at.toISOString(),
      },
      helpers
    );
  },

  async deleteUser(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  },

  async getUsers(): Promise<User[]> {
    const users = await prisma.user.findMany();
    return users.map(
      (user) =>
        new User(
          {
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            user_type: user.user_type as 1 | 2,
            status: user.status as 0 | 1,
            created_at: user.created_at.toISOString(),
            updated_at: user.updated_at.toISOString(),
          },
          helpers
        )
    );
  },
});

export { createPrismaUserRepository };
