import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { prisma } from '@src/prisma';

export default async (request: Request, response: Response, next: NextFunction) => {
	try {
		const refresh_token_secret = String(process.env.JWT_REFRESH_TOKEN);
		// get JWT refresh token from headers
		const authHeader = request.headers.authorization;
		if (!authHeader || authHeader == undefined || authHeader == null)
			throw new Error('A JWT is needed to use this route.');

		// remove Bearer prefix from token
		const token = String(authHeader && authHeader.split(' ')[1]);

		if (!token) throw new Error('No JWT refresh token was found! Redirect to login.');

		const payload = verify(token, refresh_token_secret);

		const userInfo = await prisma.user.findUnique({
			where: {
				id: request.params.id,
			},
		});

		if (payload['id'] !== request.params.id)
			throw new Error('User ID and payload ID are not the same.');

		if (userInfo?.token_version == null) throw new Error('No user found.');

		if (payload['token_version'] !== userInfo.token_version) {
			throw new Error('Your session has been invalidated by an admin.');
		}

		next();
	} catch (error) {
		return response.status(401).json(error.message);
	}
};
