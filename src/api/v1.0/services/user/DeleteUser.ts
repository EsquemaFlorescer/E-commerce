import { Request, urlencoded } from 'express';

import { SqliteUsersRepository } from '@v1/repositories/implementations';
import { IUsersRepository } from '@v1/repositories';

import { IMailProvider } from '@v1/providers';
import { MailTrapMailProvider } from '@v1/providers/implementations';

class DeleteUserService {
	constructor(
		private usersRepository: IUsersRepository,
		private mailProvider: IMailProvider
	) {}

	async delete(id: string) {
		try {
			const user = await this.usersRepository.findById(id);

			if (user == null) {
				throw new Error('user with this id not found.');
			}

			await this.mailProvider.sendMail({
				to: {
					name: user.name,
					email: user.email,
				},
				from: {
					name: 'NeoExpensive Team',
					email: 'equipe@neoexpensive.com',
				},

				subject: `Goodbye from NeoExpensive ${user.name}!`,
				body: `We're so sad to see you go ${user.name}...`,
			});

			await this.usersRepository.delete(id);
		} catch (error) {
			throw new Error(error.message);
		}
	}
}

export default async (request: Request) => {
	try {
		const UsersRepository = new SqliteUsersRepository();
		const MailProvider = new MailTrapMailProvider();
		const DeleteUser = new DeleteUserService(UsersRepository, MailProvider);

		await DeleteUser.delete(request.params.id);

		return {
			status: 200,
			message: 'User deleted with success',
		};
	} catch (error) {
		return {
			error: true,
			status: 400,
			message: error.message,
		};
	}
};
