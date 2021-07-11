import request from 'supertest';
import { app } from '@src/app';

import { prisma } from '@src/prisma';
import { sign } from 'jsonwebtoken';
import { User } from '@v1/entities';
import { ApiResponse } from '@tests/types/API';

var userDTO = {
	id: '',
	name: 'test',
	email: 'test@test.com',
	password: '123',
	access_token: '',
	refresh_token: '',
};

export const forgetPasswordTest = () => {
	it('should not be able to find user', async () => {
		const access_token_secret = String(process.env.JWT_ACCESS_TOKEN);

		var token = sign(userDTO, access_token_secret);
		token = `Bearer ${token}`;

		const activate: ApiResponse<User> = await request(app)
			.post('/v1/user/activate')
			.set('authorization', token);
		userDTO.id = activate.body.user.id;
		userDTO.access_token = activate.body.access_token;

		const login: ApiResponse<User> = await request(app)
			.post('/v1/user/login')
			.set('authorization', `Bearer ${userDTO.access_token}`);
		userDTO.refresh_token = login.body.refresh_token;

		const { status, body }: ApiResponse<User> = await request(app)
			.post(`/v1/user/forgot-password/${1}`)
			.set('authorization', `Bearer ${userDTO.refresh_token}`);

		expect(status).toBe(400);
		expect(body).toBe('Cannot find user with that id.');
	});

	it('should reset user password', async () => {
		await prisma.user.deleteMany();

		const access_token_secret = String(process.env.JWT_ACCESS_TOKEN);

		var token = sign(userDTO, access_token_secret);
		token = `Bearer ${token}`;

		const activate: ApiResponse<User> = await request(app)
			.post('/v1/user/activate')
			.set('authorization', token);
		userDTO.id = activate.body.user.id;
		userDTO.access_token = activate.body.access_token;

		const login: ApiResponse<User> = await request(app)
			.post('/v1/user/login')
			.set('authorization', `Bearer ${userDTO.access_token}`);
		userDTO.refresh_token = login.body.refresh_token;

		const { status, body }: ApiResponse<User> = await request(app)
			.post(`/v1/user/forgot-password/${userDTO.id}`)
			.set('authorization', `Bearer ${userDTO.refresh_token}`);

		expect(status).toBe(200);
		expect(body).toBe('Sent you an e-mail.');
	});
};
