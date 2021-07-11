import request from 'supertest';
import { app } from '@src/app';

import { sign } from 'jsonwebtoken';
import { ApiResponse } from '@src/tests/types/API';
import { User } from '@v1/entities';
import { Cart } from '@v1/entities';

var UserDTO = {
	id: '',
	name: 'test',
	email: 'test@test.com',
	password: '123',
	access_token: '',
	refresh_token: '',
};

export const CartTest = () => {
	it('should create cart entity', async () => {
		const cart = new Cart('1', 1);

		expect(cart.user_id).toBe('1');
		expect(cart.item_id).toBe(1);
	});

	it('should create new cart', async () => {
		const access_token_secret = String(process.env.JWT_ACCESS_TOKEN);

		var token = sign(UserDTO, access_token_secret);
		token = `Bearer ${token}`;

		const test: ApiResponse<User> = await request(app)
			.post('/v1/user/activate')
			.set('authorization', token);

		expect(test.status).toBe(201);
		UserDTO.id = test.body.user.id;
		UserDTO.access_token = test.body.access_token;

		const login: ApiResponse<void> = await request(app)
			.post('/v1/user/login')
			.set('authorization', `Bearer ${UserDTO.access_token}`);
		expect(login.status).toBe(200);
		UserDTO.refresh_token = login.body.refresh_token;

		const { status, body }: ApiResponse<Cart> = await request(app)
			.post(`/v1/user/cart/${UserDTO.id}`)
			.set('authorization', `Bearer ${UserDTO.refresh_token}`)
			.send({ item_id: 1 });

		expect(status).toBe(201);
		expect(body).toBe('Cart item created with success!');
	});

	it('should delete cart', async () => {
		const { status, body }: ApiResponse<void> = await request(app)
			.delete(`/v1/user/cart/${UserDTO.id}`)
			.set('authorization', `Bearer ${UserDTO.refresh_token}`)
			.query({ id: 1 });

		expect(status).toBe(200);
		expect(body).toBe('Delete item from cart with success!');
	});
};
