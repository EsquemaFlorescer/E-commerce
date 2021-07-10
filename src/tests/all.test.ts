import { CreateUserTest, ReadUserTest, UpdateUserTest, DeleteUserTest } from './unit/user';
import { emailTest, usernameTest, tokenTest } from './unit/auth';
import { CreateAddressTest } from './unit/address';
import { prisma } from '@src/prisma';

beforeAll(async () => {
	await prisma.user.deleteMany();
});

// describe('Create Addres', CreateAddressTest);
describe('token creation', tokenTest);
describe('username auth', usernameTest);
describe('email auth', emailTest);

describe('Create user', CreateUserTest);
describe('Read user', ReadUserTest);
describe('Update user', UpdateUserTest);
describe('Delete user', DeleteUserTest);
