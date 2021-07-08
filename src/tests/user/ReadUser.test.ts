import request from 'supertest';
import { sign } from 'jsonwebtoken';

import { app } from '@src/app';
import { prisma } from '@src/prisma';
import { User } from '@v1/entities';

import { ApiResponse } from '../types/API';

var ReadAllUsersResponse = {
	id: '',
	name: '',
	email: '',
	password: '',
};

type CreateUserType = {
	name: string;
	email: string;
	password: string;
};

const CreateUser = async ({ name, email, password }: CreateUserType) => {
	const access_token = String(process.env.JWT_ACCESS_TOKEN);

	await request(app).post('/v1/user').send({ name, email, password });

	const userInfo = { name, email, password };

	let token = sign(userInfo, access_token);
	token = `Bearer ${token}`;

	const {
		body: { message, user },
	}: ApiResponse<User> = await request(app).post('/v1/user/activate').set('authorization', token);

	return {
		message,
		user,
	};
};

describe('Read User', () => {
	beforeAll(async () => {
		await prisma.user.deleteMany();
		await prisma.$disconnect();
	});

	afterAll(async () => {
		await prisma.user.deleteMany();
		await prisma.$disconnect();
	});

	it('should create multiple users', async () => {
		const { message, user } = await CreateUser({
			name: 'vitor',
			email: 'test1@gmail.com',
			password: '123',
		});

		const { message: message2, user: user2 } = await CreateUser({
			name: 'vitor',
			email: 'test2@gmail.com',
			password: '123',
		});

		const created_at = Number(String(user.created_at).slice(17, 22).split('.').join(''));
		const created_at2 = Number(String(user2.created_at).slice(17, 22).split('.').join(''));

		expect(message).toBe(message2);
		expect(created_at2).toBeGreaterThanOrEqual(created_at);
	}, 10000);

	it('should list all users', async () => {
		const { status, body }: ApiResponse<User[]> = await request(app).get('/v1/user');

		const { users } = body;

		expect(status).toBe(202);
		expect(users.length).toBe(2);

		ReadAllUsersResponse = {
			id: users[0].id,
			name: users[0].name,
			email: users[0].email,
			password: users[0].password,
		};
	});

	it('should list user by id', async () => {
		const { id, name, email, password } = ReadAllUsersResponse;
		const { status, body }: ApiResponse<User> = await request(app).get(`/v1/user/${id}`);

		const { users } = body;

		expect(status).toBe(202);
		expect(users.id).toBe(id);
		expect(users.name).toBe(name);
		expect(users.email).toBe(email);
		expect(users.password).toBe(password);
	});

	it('should list users with pagination', async () => {
		const { body }: ApiResponse<User[]> = await request(app).get('/v1/user').query({
			page: 0,
			quantity: 2,
		});

		const { users } = body;
		expect(users.length).toBe(2);
	});

	it('should sort users by when they were created', async () => {
		const { body }: ApiResponse<User[]> = await request(app).get('/v1/user').query({
			property: 'created_at',
			sort: 'asc',
		});

		const { users } = body;

		const user = String(users[0].created_at);
		const user2 = String(users[1].created_at);

		const created_at = Number(user.slice(17, 19));
		const created_at2 = Number(user2.slice(17, 19));

		expect(created_at).toBeLessThanOrEqual(created_at2);
	});
});
