import { verify } from 'jsonwebtoken';

import { Request, Response, NextFunction } from 'express';

export default (request: Request, response: Response, next: NextFunction) => {
	try {
		const DASH_REFRESH_TOKEN = String(process.env.DASH_REFRESH_TOKEN);
		const authHeader = request.headers.authorization;
		!authHeader &&
			response.status(400).json({
				message: 'No Dash JWT refresh token was found! Redirect to login.',
			});
		const token = String(authHeader && authHeader.split(' ')[1]);

		verify(token, DASH_REFRESH_TOKEN);

		next();
	} catch (error) {
		return response.status(401).json(error.message);
	}
};
