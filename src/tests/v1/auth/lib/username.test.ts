import { usernameLogin } from '@v1/auth/lib/username';
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
	username: '',
	userhash: '',
	email: 'test@test.com',
	password: '123',
};

describe('email', () => {
	const usersRepository = new SqliteUsersRepository();
	const loginUsername = new usernameLogin(usersRepository);

	it('should be able to login with username', async () => {
		const token = jwt.sign(userInfo, jwt_access_token_secret);
		const activate = await request(app)
			.post('/v1/user/activate')
			.set('authorization', `Bearer ${token}`);

		userInfo.username = activate.body.user.username;
		userInfo.userhash = activate.body.user.userhash;

		const { user, failed_too_many, matchPassword } = await loginUsername.handle(
			userInfo.username,
			userInfo.userhash,
			userInfo.password
		);

		expect(user.id.length).toBe(36);
		expect(user.name).toBe(userInfo.name);
		expect(user.email).toBe(userInfo.email);
		expect(user.username).toBe(userInfo.username);
		expect(user.userhash).toBe(userInfo.userhash);

		expect(matchPassword).toBe(false);
		expect(failed_too_many).toBe(false);
	});

	it('should not be able to find an username to auth to', async () => {
		try {
			await loginUsername.handle('', userInfo.userhash, userInfo.password);
		} catch (error) {
			expect(error.message).toBe('Wrong username!');
		}
	});

	it('should not be able to login with wrong passowrd', async () => {
		const { user, failed_too_many, matchPassword } = await loginUsername.handle(
			userInfo.username,
			userInfo.userhash,
			''
		);

		expect(failed_too_many).toBe(false);
		expect(matchPassword).toBe(true);
		expect(user).toBeTruthy();

		expect(user.id).toHaveLength(36);
	});

	it('should fail too many times when trying to login', async () => {
		await prisma.user.updateMany({
			where: {
				username: userInfo.username,
				userhash: userInfo.userhash,
			},
			data: {
				failed_attemps: 100,
			},
		});

		const { user, matchPassword, failed_too_many } = await loginUsername.handle(
			userInfo.username,
			userInfo.userhash,
			'1'
		);

		expect(user).toBeTruthy();
		expect(matchPassword).toBe(false);
		expect(failed_too_many).toBe(true);

		expect(user.name).toBe(userInfo.name);
	});

	beforeAll(async () => await clear());
});
