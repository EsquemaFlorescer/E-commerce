import { verify } from 'jsonwebtoken';

import { Request, Response, NextFunction } from 'express';

import CheckRefreshToken from '@v1/utils/CheckRefreshToken';
import { prisma } from '@src/prisma';

export default async (
	request: Request,
	response: Response,
	next: NextFunction
) => {
	try {
		// get JWT refresh token from headers
		const authHeader = request.headers.authorization;

		// remove Bearer prefix from token
		const token = String(authHeader && authHeader.split(' ')[1]);

		if (!token)
			throw new Error('No JWT refresh token was found! Redirect to login.');

		const userInfo = await prisma.user.findUnique({
			where: {
				id: request.params.id,
			},
		});

		if (userInfo?.token_version == null) {
			throw new Error('No user found.');
		}

		const isInvalidated = CheckRefreshToken(token, userInfo.token_version);

		if (isInvalidated) {
			throw new Error('Your session has been invalidated by an admin.');
		}

		next();
	} catch (error) {
		return response.status(401).json(error.message);
	}
};
