import request from 'supertest';
import { app } from '@src/app';

import { ApiResponse } from '@tests/types/API';
import { clear } from '../../clear';

import jwt from 'jsonwebtoken';

describe('Create User', () => {
	const access_token_secret = String(process.env.JWT_ACCESS_TOKEN);

	const userDTO = {
		name: 'test',
		email: 'test@test.com',
		password: '123',
	};

	it('should create user', async () => {
		const { status, body }: ApiResponse<void> = await request(app).post('/v1/user').send(userDTO);

		expect(status).toBe(200);
		expect(body).toBe('Sent verification message to your e-mail!');
	});

	it('should fail to create user that already exists', async () => {
		const token = jwt.sign(userDTO, access_token_secret);
		await request(app).post('/v1/user/activate').set('authorization', `Bearer ${token}`);

		const { status, body }: ApiResponse<void> = await request(app).post('/v1/user').send(userDTO);

		expect(status).toBe(400);
		expect(body).toBe('User already exists.');
	});

	beforeAll(async () => await clear());
});
