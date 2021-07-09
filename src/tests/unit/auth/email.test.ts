import request from 'supertest';
import { app } from '@src/app';

import auth from '@v1/auth';
import { sign } from 'jsonwebtoken';

import { prisma } from '@src/prisma';
import { ApiResponse } from '../../types/API';
import { User } from '@v1/entities';
import { compare } from 'bcrypt';

describe('email login', () => {
	it('should fail to login with e-mail', async () => {
		try {
			const loginInfo = {
				email: 'test@test.com',
				password: '123',
			};

			await auth.loginEmail(loginInfo);
		} catch (error) {
			expect(error.message).toBe('Error: Wrong e-mail!');
		}
	});

	it('should fail to login with e-mail and password', async () => {
		try {
			const access_token_secret = String(process.env.JWT_ACCESS_TOKEN);
			const loginInfo = {
				name: 'test',
				email: 'test@test.com',
				password: '123',
			};

			const { status, body }: ApiResponse<void> = await request(app)
				.post('/v1/user')
				.send(loginInfo);

			expect(status).toBe(200);
			expect(body).toBe('Sent verification message to your e-mail!');

			let token = sign(loginInfo, access_token_secret);
			token = `Bearer ${token}`;

			const { status: activateStatus, body: activateBody }: ApiResponse<User> = await request(app)
				.post('/v1/user/activate')
				.set('authorization', token);

			expect(activateStatus).toBe(201);
			expect(activateBody.message).toBe('User created with success!');
			expect(activateBody.user.name).toBe(loginInfo.name);
			expect(activateBody.user.email).toBe(loginInfo.email);

			const comparePassword = await compare(loginInfo.password, activateBody.user.password);
			expect(comparePassword).toBeTruthy();

			await auth.loginEmail({
				email: loginInfo.email,
				password: '1',
			});
		} catch (error) {
			expect(error.message).toBe('Error: Wrong password!');
		}
	});

	it('should fail too many times when trying to login with wrong password', async () => {
		const loginInfo = {
			name: 'test',
			email: 'test@test.com',
			password: '1',
		};

		try {
			const { matchPassword } = await auth.loginEmail(loginInfo);

			expect(matchPassword?.failed_attemps).toBe(1);
		} catch (error) {
			console.log(error);
		}
	});

	it('should login with e-mail successfully', async () => {
		const loginInfo = {
			email: 'test@test.com',
			password: '123',
		};

		const { body }: ApiResponse<void> = await request(app).post('/v1/user/login').send(loginInfo);

		expect(body.social_login).toBe(true);
		expect(body.refresh_token.length).toBeGreaterThan(1);
	});

	beforeAll(async () => {
		await prisma.user.deleteMany();
		await prisma.$disconnect();
	});

	afterAll(async () => {
		await prisma.user.deleteMany();
		await prisma.$disconnect();
	});
});
