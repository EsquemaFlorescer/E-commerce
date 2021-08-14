import { CreateUserController } from './CreateUserController';
import { CreateUserUseCase } from './CreateUserUseCase';

import { SqliteUsersRepository } from '@v1/repositories/implementations';
import {
	ValidatorValidatorProvider,
	BcryptHashPasswordProvider,
	JWTTokenProvider,
} from '@v1/providers/implementations';

const usersRepository = new SqliteUsersRepository();

const validatorProvider = new ValidatorValidatorProvider();
const hashPasswordProvider = new BcryptHashPasswordProvider();
const tokenProvider = new JWTTokenProvider();

const createUserUseCase = new CreateUserUseCase(
	usersRepository,
	validatorProvider,
	hashPasswordProvider,
	tokenProvider
);
const createUser = new CreateUserController(createUserUseCase);

export { createUser };
