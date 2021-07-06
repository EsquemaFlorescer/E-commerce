import request from 'supertest';
import { app } from '@src/app';

import { prisma } from '@src/prisma';
import { User } from '@v1/entities';

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

type ApiResponse = {
	status: number;
	body: {
		message: string;
		user: User;
		access_token: string;
		refresh_token: string;
	};
};

var UpdateUserStore: User = {
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

describe('Update user', () => {
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

		const { user } = body;
		UpdateUserStore = {
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

		tokens.access_token = body.access_token;

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

	it('should update user', async () => {
		const { id } = UpdateUserStore;
		const { name, email, password, cpf, lastname, username } =
			UpdateUserRequest;

		const { status, body }: ApiResponse = await request(app)
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
});
