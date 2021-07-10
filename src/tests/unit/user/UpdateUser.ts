import request from 'supertest';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import { app } from '@src/app';
import { prisma } from '@src/prisma';
import { User } from '@v1/entities';

import { ApiResponse } from '@src/tests/types/API';

const CreateUserRequest = {
	name: 'test',
	email: 'test@test.com',
	password: '123',
};

const UpdateUserRequest = {
	name: 'test2',
	lastname: 'jest',
	username: 'test2jest',
	cpf: '111.111.111-11',
	email: 'test@jest.com',
	password: '123',
};

var UpdateUserStore = {
	id: '',
};

var tokens = {
	access_token: '',
	refresh_token: '',
};

export const UpdateUserTest = () => {
	it('should send token to e-mail', async () => {
		const { name, email, password } = CreateUserRequest;

		try {
			const { status, body }: ApiResponse<void> = await request(app).post('/v1/user').send({
				name,
				email,
				password,
			});
			expect(status).toBe(200);

			expect(body).toBe('Sent verification message to your e-mail!');
		} catch (error) {}
	});

	it('should create user with e-mail token', async () => {
		const access_token_secret = String(process.env.JWT_ACCESS_TOKEN);
		const { name, email, password } = CreateUserRequest;

		let token = sign(CreateUserRequest, access_token_secret);
		token = `Bearer ${token}`;

		const { status, body, headers }: ApiResponse<User> = await request(app)
			.post('/v1/user/activate')
			.set('authorization', token);

		expect(status).toBe(201);

		const { access_token, user, message } = body;
		tokens.access_token = access_token;

		expect(headers.authorization.length).toBeGreaterThan(1);
		expect(access_token.length).toBeGreaterThan(1);

		expect(message).toBe('User created with success!');

		expect(user.name).toBe(name);
		expect(user.email).toBe(email);

		const comparePassword = await compare(password, user.password);
		expect(comparePassword).toBeTruthy();

		UpdateUserStore = {
			id: user.id,
		};
	});

	it('should authenticate user', async () => {
		const { access_token } = tokens;

		const { status, body }: ApiResponse<void> = await request(app)
			.post('/v1/user/login')
			.set('authorization', `Bearer ${access_token}`);

		tokens.refresh_token = body.refresh_token;

		expect(status).toBe(200);
		expect(body.refresh_token.length).toBeGreaterThan(1);
		expect(body.jwt_login).toBe(true);
	});

	it('should update user', async () => {
		const { id } = UpdateUserStore;
		const { name, email, password, cpf, lastname, username } = UpdateUserRequest;

		const { status, body }: ApiResponse<User> = await request(app)
			.patch(`/v1/user/${id}`)
			.set('authorization', `Bearer ${tokens.refresh_token}`)
			.send({
				name,
				email,
				password,
				cpf,
				lastname,
				username,
			});

		expect(status).toBe(200);
		const { user } = body;

		expect(user.id).toBe(id);
		expect(user.name).toBe(UpdateUserRequest.name);
		expect(user.email).toBe(UpdateUserRequest.email);
	});

	beforeAll(async () => {
		await prisma.user.deleteMany();
		await prisma.$disconnect();
	});

	afterAll(async () => {
		await prisma.user.deleteMany();
		await prisma.$disconnect();
	});
};
