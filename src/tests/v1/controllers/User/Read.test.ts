import request from 'supertest';
import { app } from '@src/app';

import { User } from '@v1/entities';
import { ApiResponse } from '@tests/types/API';

import jwt from 'jsonwebtoken';
import { clear } from '../../clear';

describe('Read user', () => {
	const access_token_secret = String(process.env.JWT_ACCESS_TOKEN);

	var userInfo = {
		id: '',
	};

	const userDTO = {
		name: 'test',
		email: 'test@test.com',
		password: 'test',
	};

	const userDTO2 = {
		name: 'test',
		email: 'test@jest.com',
		password: 'test',
	};

	it('should create some users', async () => {
		const token = jwt.sign(userDTO, access_token_secret);
		const token2 = jwt.sign(userDTO2, access_token_secret);

		const { body } = await request(app)
			.post('/v1/user/activate')
			.set('authorization', `Bearer ${token}`);

		userInfo.id = body.user.id;

		await request(app).post('/v1/user/activate').set('authorization', `Bearer ${token2}`);
	});

	it('should find user by id', async () => {
		const { status, body }: ApiResponse<User> = await request(app).get(`/v1/user/${userInfo.id}`);

		expect(status).toBe(202);
		expect(body).toBeTruthy();
		expect(body.users.id).toBe(userInfo.id);
	});

	it('should read all users', async () => {
		const { status, body }: ApiResponse<User[]> = await request(app).get('/v1/user');
		expect(status).toBe(202);
		expect(body).toBeTruthy();
		expect(body.users[0].id.length).toBeGreaterThan(10);
	});

	it('should list users with pagination', async () => {
		const { status, body }: ApiResponse<User[]> = await request(app)
			.get('/v1/user')
			.query({ page: 0, quantity: 1 });

		expect(status).toBe(202);
		expect(body).toBeTruthy();

		expect(body.users[0]).toBeTruthy();
		expect(body.users).toHaveLength(1);
	});

	it('should list all users by property', async () => {
		const { status, body }: ApiResponse<User[]> = await request(app)
			.get('/v1/user')
			.query({ property: 'created_at', sort: 'desc' });

		expect(status).toBe(202);
		expect(body).toBeTruthy();

		expect(body.message).toBe('Listed users with success!');
		expect(body.users[0].created_at).toBeGreaterThan(body.users[1].created_at);
	});

	it('should list users by property with pagination', async () => {
		const { status, body }: ApiResponse<User[]> = await request(app)
			.get('/v1/user')
			.query({ page: 0, quantity: 15, property: 'created_at', sort: 'asc' });

		expect(status).toBe(202);
		expect(body.message).toBe('Listed users with success!');
		expect(body.users[0].created_at).toBeLessThan(body.users[1].created_at);
	});

	beforeAll(async () => await clear());
});
