import request from 'supertest';
import { app } from '@src/app';

import { prisma } from '@src/prisma';
import { User } from '@v1/entities';

type ApiResponse = {
	status: number;
	body: {
		message: string;
		user: User;
		access_token: string;
		refresh_token: string;
	};
};

const CreateUserRequest = {
	name: 'test',
	email: 'test@test.com',
	password: '123',
};

var DeleteUserStore: User = {
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

var tokens = {
	access_token: '',
	refresh_token: '',
};

describe('Delete user', () => {
	beforeAll(async () => {
		await prisma.user.deleteMany();
	});

	it('should create a new user', async () => {
		const { name, email, password } = CreateUserRequest;

		const { status, body }: ApiResponse = await request(app)
			.post('/v1/user')
			.send({
				name,
				email,
				password,
			});

		const { user, access_token } = body;
		DeleteUserStore = {
			id: user.id,
			created_at: user.created_at,
			admin: user.admin,
			name: user.name,
			lastname: user.lastname,
			username: user.username,
			userhash: user.userhash,
			cpf: user.cpf,
			email: user.email,
			password: user.password,
		};

		tokens.access_token = access_token;

		expect(status).toBe(201);
	});

	it('should authenticate user', async () => {
		const { access_token } = tokens;

		const { status, body }: ApiResponse = await request(app)
			.post('/v1/user/login')
			.set('authorization', `Bearer ${access_token}`);

		tokens.refresh_token = body.refresh_token;

		expect(status).toBe(200);
	});

	it('should delete user', async () => {
		const { id } = DeleteUserStore;

		const { status }: ApiResponse = await request(app)
			.delete(`/v1/user/${id}`)
			.set('authorization', `Bearer ${tokens.refresh_token}`);

		const users = await prisma.user.findMany();

		expect(status).toBe(200);
		expect(users.length).toBe(0);
	});
});
