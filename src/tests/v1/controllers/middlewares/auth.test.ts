import request from 'supertest';
import { app } from '@src/app';

import jwt from 'jsonwebtoken';

import { clear } from '@tests/v1/clear';
import { ApiResponse } from '@tests/types/API';
import { User } from '@src/api/v1.0/entities';

describe('Auth middleware', () => {
	const jwt_access_token_secret = String(process.env.JWT_ACCESS_TOKEN);
	const jwt_refresh_token_secret = String(process.env.JWT_REFRESH_TOKEN);
	const dummy_id = '00000000-0000-0000-0000-000000000001';

	var tokenInfo = {
		id: '00000000-0000-0000-0000-000000000000',
		name: 'test',
		email: 'test@test.com',
		password: '123',
	};

	var userInfo = {
		id: '',
		access: '',
		refresh: '',
	};

	it('should not find a auth token', async () => {
		try {
			const login: ApiResponse<void> = await request(app).delete(`/v1/user/${dummy_id}`);
		} catch (error) {
			expect(error.message).toBe('A JWT is needed to use this route.');
		}
	});

	it('should fail to find token', async () => {
		const token = jwt.sign(tokenInfo, jwt_access_token_secret);

		try {
			const login: ApiResponse<void> = await request(app)
				.delete(`/v1/user/${dummy_id}`)
				.set('authorization', token);
		} catch (error) {
			expect(error.message).toBe('No JWT refresh token was found! Redirect to login.');
		}
	});

	it('should fail to find user with that id', async () => {
		const token = jwt.sign(tokenInfo, jwt_access_token_secret);

		try {
			const login: ApiResponse<void> = await request(app)
				.post(`/v1/user/login/${dummy_id}`)
				.set('authorization', `Bearer ${token}`);
		} catch (error) {
			expect(error.message).toBe('User ID and payload ID are not the same.');
		}
	});

	it('should create a new user', async () => {
		const tokenInfo = {
			name: 'test',
			email: 'test@test.com',
			password: '123',
		};

		const token = jwt.sign(tokenInfo, jwt_access_token_secret);
		const { status, body }: ApiResponse<User> = await request(app)
			.post('/v1/user/activate')
			.set('authorization', `Bearer ${token}`);
		expect(status).toBe(201);
		userInfo.id = body.user.id;
		userInfo.access = body.access_token;
	});

	it('should have session invalidated', async () => {
		await request(app).post('/v1/user/login').set('authorization', `Bearer ${userInfo.access}`);

		const tokenInfo = {
			id: userInfo.id,
			token_version: 2,
		};

		const token = jwt.sign(tokenInfo, jwt_refresh_token_secret);

		const { body }: ApiResponse<void> = await request(app)
			.delete(`/v1/user/${userInfo.id}`)
			.set('authorization', `Bearer ${token}`);

		expect(body).toBe('Your session has been invalidated by an admin.');
	});

	beforeAll(async () => await clear());
});
