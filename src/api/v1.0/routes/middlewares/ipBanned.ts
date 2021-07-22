import { Request, Response, NextFunction } from 'express';
import bannedIps from '@src/ips.json';

export const isIpBanned = (user_ip: string): boolean => {
	user_ip = user_ip.slice(7);
	var isBanned: boolean = false;

	bannedIps.forEach(ip => {
		if (ip == user_ip) {
			return (isBanned = true);
		} else {
			return (isBanned = false);
		}
	});

	return isBanned;
};

export default (request: Request, response: Response, next: NextFunction) => {
	try {
		const { ip } = request;

		const isBanned = isIpBanned(ip);

		if (isBanned == true) {
			throw new Error('Your ip is banned');
		}

		next();
	} catch (error) {
		return response.status(403).json(error.message);
	}
};
