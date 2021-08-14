import { IToken } from '../';

import { sign } from 'jsonwebtoken';

export class JWTTokenProvider implements IToken {
	create(payload: string | object, key: string, expiresIn?: string | number): string {
		if (!expiresIn) {
			expiresIn = '15m';
		}

		const token = sign(payload, key, { expiresIn });

		return token;
	}
}
