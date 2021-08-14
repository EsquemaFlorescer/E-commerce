import { createUserUseCase, hashPasswordProvider } from '.';

const userDTO = {
	name: 'test',
	email: 'test@test.com',
	password: '123',
};

describe('Create User', () => {
	it('should create an user', async () => {
		const { name, email, password } = userDTO;

		const { token, user } = await createUserUseCase.execute(userDTO);

		const comparePasswords = await hashPasswordProvider.compare(password, user.password);

		expect(token).toBeTruthy();

		expect(user.name).toBe(name);
		expect(user.email).toBe(email);

		/* expect user password to be hashed & to match the password it entered  */
		expect(comparePasswords).toBe(true);
	});
});
