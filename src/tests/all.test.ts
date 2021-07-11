import {
	CreateUserTest,
	ReadUserTest,
	UpdateUserTest,
	DeleteUserTest,
	AddressTest,
	CartTest,
} from './unit/user';
import { emailTest, usernameTest, tokenTest } from './unit/auth';
import { IPTest } from './unit/IpBan';

import { prisma } from '@src/prisma';
afterEach(async () => {
	await prisma.address.deleteMany();
	await prisma.cart.deleteMany();
});
describe('token creation', tokenTest);
describe('username auth', usernameTest);
describe('email auth', emailTest);

describe('Create user', CreateUserTest);
describe('Read user', ReadUserTest);
describe('Update user', UpdateUserTest);
describe('Delete user', DeleteUserTest);

describe('Create Address', AddressTest);
describe('Create Address', CartTest);
describe('IP ban', IPTest);
