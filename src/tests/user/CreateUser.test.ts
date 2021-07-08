import request from 'supertest';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import { app } from '@src/app';
import { prisma } from '@src/prisma';
import { User } from '@v1/entities';

type CreateUserRequestType = {
	name: string;
	email: string;
	password: string;
};

type ApiResponse<T> = {
	status: number;

	body: {
		message: string;
		user: T;
		access_token: string;
	};

	headers: {
		authorization: string;
	};
};

const CreateUserRequest: CreateUserRequestType = {
	name: 'vitor',
	email: 'vitor@gmail.com',
	password: '123',
};

describe('User Register', () => {
	beforeAll(async () => {
		await prisma.user.deleteMany();
		await prisma.$disconnect();
	});

	afterAll(async () => {
		await prisma.user.deleteMany();
		await prisma.$disconnect();
	});

	it('should send token to e-mail', async () => {
		const { name, email, password } = CreateUserRequest;

		const { status, body }: ApiResponse<void> = await request(app).post('/v1/user').send({
			name,
			email,
			password,
		});

		expect(status).toBe(200);

		expect(body).toBe('Sent verification message to your e-mail!');
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

		expect(headers.authorization.length).toBeGreaterThan(1);
		expect(access_token.length).toBeGreaterThan(1);

		expect(message).toBe('User created with success!');

		expect(user.name).toBe(name);
		expect(user.email).toBe(email);

		const comparePassword = await compare(password, user.password);
		expect(comparePassword).toBeTruthy();
	});
});
