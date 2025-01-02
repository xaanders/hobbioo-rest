// src/useCases/createUser.ts
import { User } from "../entities/user.js";
import { IHelpers } from "../shared/interfaces.js";
import { ValidationError } from "../shared/error/validation-error.js";
import { UseCaseError } from "../shared/error/use-case-error.js";
import { IUserRepository } from "../gateways/user-repository.js";

type CreateUserDTO = {
	first_name: string;
	last_name: string;
	email: string;
	user_type: 1 | 2;
};

export const createUser = ({ userRepository, helpers }: { userRepository: IUserRepository, helpers: IHelpers }) =>
	async (userData: CreateUserDTO) => {
		try {
			const id = helpers.generateId();
			const user = new User(
				id,
				userData.first_name,
				userData.last_name,
				userData.email,
				userData.user_type,
				helpers
			);
			await userRepository.createUser(user);
			return user.userToJson();
		} catch (error) {
			if (error instanceof ValidationError) {
				throw new UseCaseError('Invalid user data: ' + error.message);
			}
			throw new UseCaseError('Failed to create user');
		}
	};
