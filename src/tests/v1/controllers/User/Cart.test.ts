import request from 'supertest';
import { app } from '@src/app';

import { ApiResponse } from '@tests/types/API';
import { User } from '@v1/entities';
import { clear } from '../../clear';

import jwt from 'jsonwebtoken';

describe('Update User', () => {
	const access_token_secret = String(process.env.JWT_ACCESS_TOKEN);

	var userInfo = {
		id: '',
		name: 'test',
		lastname: 'jest',
		email: 'test@test.com',
		password: '123',
		cpf: '000.000.000-00',
		access: '',
		refresh: '',
		cart: {
			item_id: 1,
		},
	};

	it('should create a test user', async () => {
		const token = jwt.sign(userInfo, access_token_secret);
		const { body }: ApiResponse<User> = await request(app)
			.post('/v1/user/activate')
			.set('authorization', `Bearer ${token}`);

		userInfo.id = body.user.id;
		userInfo.access = body.access_token;
	});

	it('should login a user', async () => {
		const { body }: ApiResponse<void> = await request(app)
			.post('/v1/user/login')
			.set('authorization', `Bearer ${userInfo.access}`);
		userInfo.refresh = body.refresh_token;
	});

	it('should create a cart for a user', async () => {
		const { id, refresh, cart } = userInfo;

		const { status, body }: ApiResponse<void> = await request(app)
			.post(`/v1/user/cart/${id}`)
			.set('authorization', `Bearer ${refresh}`)
			.send(cart);

		expect(status).toBe(201);
		expect(body).toBe('Cart item created with success!');
	});

	it('should delete an address', async () => {
		const { id, refresh } = userInfo;

		const { status, body }: ApiResponse<void> = await request(app)
			.delete(`/v1/user/cart/${id}`)
			.set('authorization', `Bearer ${refresh}`)
			.query({ id: 1 });

		expect(status).toBe(200);
		expect(body).toBe('Delete item from cart with success!');
	});

	beforeAll(async () => await clear());
});
