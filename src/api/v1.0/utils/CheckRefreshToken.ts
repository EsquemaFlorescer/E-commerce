import { verify } from 'jsonwebtoken';

export default (token: string, token_version: number): boolean => {
	const refresh_token = String(process.env.JWT_REFRESH_TOKEN);
	const payload = verify(token, refresh_token);

	if (payload['token_version'] !== token_version) {
		//succeed
		return true;
	}

	return false;
};
