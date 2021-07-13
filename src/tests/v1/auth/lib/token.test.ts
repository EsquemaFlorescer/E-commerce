import token from '@v1/auth/lib/token';
import jwt from 'jsonwebtoken';

const jwt_access_token_secret = String(process.env.JWT_ACCESS_TOKEN);
const jwt_refresh_token_secret = String(process.env.JWT_REFRESH_TOKEN);

const dash_access_token_secret = String(process.env.DASH_ACCESS_TOKEN);
const dash_refresh_token_secret = String(process.env.DASH_REFRESH_TOKEN);

const tokenInfo = {
	id: '00000000-0000-0000-0000-000000000000',
	token_version: 0,
};

describe('token', () => {
	it('should create a normal access_token', async () => {
		const access_token = token.createAccessToken(tokenInfo, '24h');
		const decoded_token = jwt.verify(access_token, jwt_access_token_secret);

		expect(access_token).toBeTruthy();
		expect(access_token.length).toBeGreaterThan(50);

		expect(decoded_token['id']).toBe(tokenInfo.id);
		expect(decoded_token['token_version']).toBe(tokenInfo.token_version);
	});

	it('should create a normal refresh_token', async () => {
		const refresh_token = token.createRefreshToken(tokenInfo, '7d');
		const decoded_token = jwt.verify(refresh_token, jwt_refresh_token_secret);

		expect(refresh_token).toBeTruthy();
		expect(refresh_token.length).toBeGreaterThan(50);

		expect(decoded_token['id']).toBe(tokenInfo.id);
		expect(decoded_token['token_version']).toBe(tokenInfo.token_version);
	});

	it('should create an admin access_token', async () => {
		const access_token = token.createAdminAccessToken(tokenInfo, '24h');
		const decoded_token = jwt.verify(access_token, dash_access_token_secret);

		expect(access_token).toBeTruthy();
		expect(access_token.length).toBeGreaterThan(50);

		expect(decoded_token['id']).toBe(tokenInfo.id);
		expect(decoded_token['token_version']).toBe(tokenInfo.token_version);
	});

	it('should create an admin refresh_token', async () => {
		const refresh_token = token.createAdminRefreshToken(tokenInfo, '7d');
		const decoded_token = jwt.verify(refresh_token, dash_refresh_token_secret);

		expect(refresh_token).toBeTruthy();
		expect(refresh_token.length).toBeGreaterThan(50);

		expect(decoded_token['id']).toBe(tokenInfo.id);
		expect(decoded_token['token_version']).toBe(tokenInfo.token_version);
	});

	it('should verify a normal access_token', async () => {
		const access_token = token.createAccessToken(tokenInfo, '24h');

		const decoded_auth = token.verifyToken(access_token, 'access');
		const decoded_jwt = jwt.verify(access_token, jwt_access_token_secret);

		expect(decoded_auth).toBeTruthy();

		expect(decoded_auth['id']).toBe(decoded_jwt['id']);
		expect(decoded_auth['token_version']).toBe(decoded_jwt['token_version']);

		expect(decoded_auth['iat']).toBe(decoded_jwt['iat']);
		expect(decoded_auth['exp']).toBe(decoded_jwt['exp']);
	});

	it('should verify a normal refresh_token', async () => {
		const refresh_token = token.createRefreshToken(tokenInfo, '24h');

		const decoded_auth = token.verifyToken(refresh_token, 'refresh');
		const decoded_jwt = jwt.verify(refresh_token, jwt_refresh_token_secret);

		expect(decoded_auth).toBeTruthy();

		expect(decoded_auth['id']).toBe(decoded_jwt['id']);
		expect(decoded_auth['token_version']).toBe(decoded_jwt['token_version']);

		expect(decoded_auth['iat']).toBe(decoded_jwt['iat']);
		expect(decoded_auth['exp']).toBe(decoded_jwt['exp']);
	});
});
