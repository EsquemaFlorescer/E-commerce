import request from 'supertest';
import { app } from '@src/app';

import { prisma } from '@src/prisma';
import auth from '@v1/auth';
import { sign, verify } from 'jsonwebtoken';
import { ApiResponse } from '../types/API';
import { User } from '@v1/entities';
import { compare } from 'bcrypt';

describe('auth service', () => {
	beforeAll(async () => {
		await prisma.user.deleteMany();
		await prisma.$disconnect();
	});

	afterAll(async () => {
		await prisma.user.deleteMany();
		await prisma.$disconnect();
	});
});
