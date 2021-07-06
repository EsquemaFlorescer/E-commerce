import request from 'supertest';

import { app } from '@src/app';
import { User } from '@v1/entities';

import { prisma } from '@src/prisma';

type ReadUserResponseType<T> = {
	status: number;

	body: {
		message: string;
		users: T;
	};
};

var ReadAllUsersResponse: User = {
	id: '',
	created_at: new Date(),
	admin: false,
	name: '',
	lastname: '',
	username: '',
	userhash: '',
	cpf: '',
	email: '',
	password: '',
};

describe('Read User', () => {
	beforeAll(async () => {
		await prisma.user.deleteMany();
	});

	afterAll(async () => {
		await prisma.user.deleteMany();
	});

	it('should create multiple users', async () => {
		const { body } = await request(app).post('/v1/user').send({
			name: 'vitor',
			email: 'vitor1@gmail.com',
			password: '123',
		});

		const { body: body2 } = await request(app).post('/v1/user').send({
			name: 'vitor',
			email: 'vitor2@gmail.com',
			password: '123',
		});

		const created_at = Number(body.user.created_at.slice(17, 19));
		const created_at2 = Number(body2.user.created_at.slice(17, 19));

		expect(created_at2).toBeGreaterThanOrEqual(created_at);
	});

	it('should list all users', async () => {
		const { status, body }: ReadUserResponseType<User[]> = await request(
			app
		).get('/v1/user');

		const { users } = body;

		expect(status).toBe(202);
		expect(users.length).toBe(2);

		ReadAllUsersResponse = {
			id: users[0].id,
			created_at: users[0].created_at,
			admin: users[0].admin,
			name: users[0].name,
			lastname: users[0].lastname,
			username: users[0].username,
			userhash: users[0].userhash,
			cpf: users[0].cpf,
			email: users[0].email,
			password: users[0].password,
		};
	});

	it('should list user by id', async () => {
		const { id, name, email, password } = ReadAllUsersResponse;
		const { status, body }: ReadUserResponseType<User> = await request(app).get(
			`/v1/user/${id}`
		);

		const { users } = body;

		expect(status).toBe(202);
		expect(users.id).toBe(id);
		expect(users.name).toBe(name);
		expect(users.email).toBe(email);
		expect(users.password).toBe(password);
	});

	it('should list users with pagination', async () => {
		const { body }: ReadUserResponseType<User[]> = await request(app)
			.get('/v1/user')
			.query({
				page: 0,
				quantity: 2,
			});

		const { users } = body;
		expect(users.length).toBe(2);
	});

	it('should sort users by when they were created', async () => {
		const { body }: ReadUserResponseType<User[]> = await request(app)
			.get('/v1/user')
			.query({
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
