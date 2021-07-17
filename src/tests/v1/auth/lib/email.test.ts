import { emailLogin } from '@v1/auth/lib/email';
import { SqliteUsersRepository } from '@v1/repositories/implementations';

import jwt from 'jsonwebtoken';

import { prisma } from '@src/prisma';

import request from 'supertest';
import { app } from '@src/app';
import { clear } from '../../clear';

const jwt_access_token_secret = String(process.env.JWT_ACCESS_TOKEN);

var userInfo = {
	id: '',
	name: 'test',
	email: 'test@test.com',
	password: '123',
};

describe('email', () => {
	const usersRepository = new SqliteUsersRepository();
	const loginEmail = new emailLogin(usersRepository);

	it('should be able to login with e-mail', async () => {
		const token = jwt.sign(userInfo, jwt_access_token_secret);
		await request(app).post('/v1/user/activate').set('authorization', `Bearer ${token}`);

		const { user, failed_too_many, matchPassword } = await loginEmail.handle(
			userInfo.email,
			userInfo.password
		);

		expect(user.id.length).toBe(36);
		expect(user.name).toBe(userInfo.name);
		expect(user.email).toBe(userInfo.email);
		expect(matchPassword).toBe(false);
		expect(failed_too_many).toBe(false);
	});

	it('should not be able to find an e-mail to auth to', async () => {
		try {
			await loginEmail.handle('jest@test.com', userInfo.password);
		} catch (error) {
			expect(error.message).toBe('Wrong e-mail!');
		}
	});

	it('should not be able to login with wrong passowrd', async () => {
		const { user, failed_too_many, matchPassword } = await loginEmail.handle(userInfo.email, '');

		expect(failed_too_many).toBe(false);
		expect(matchPassword).toBe(true);
		expect(user).toBeTruthy();

		expect(user.id).toHaveLength(36);
	});

	it('should fail too many times when trying to login', async () => {
		await prisma.user.updateMany({
			where: {
				email: 'test@test.com',
			},
			data: {
				failed_attemps: 20,
			},
		});

		const { user, matchPassword, failed_too_many } = await loginEmail.handle('test@test.com', '1');

		expect(user).toBeTruthy();
		expect(matchPassword).toBe(false);
		expect(failed_too_many).toBe(true);

		expect(user.name).toBe(userInfo.name);
	});

	beforeAll(async () => await clear());
});
