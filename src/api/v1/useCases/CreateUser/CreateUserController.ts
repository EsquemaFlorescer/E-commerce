import { Request, Response } from 'express';

import { ICreateUserRequestDTO } from './CreateUserDTO';
import { CreateUserUseCase } from './CreateUserUseCase';

export class CreateUserController {
	constructor(private createUserUseCase: CreateUserUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		/* repassing information with spread operator so the
		controller doesn't know what is inside the body  */
		const { ...props }: ICreateUserRequestDTO = request.body;

		const { token, user } = await this.createUserUseCase.execute({ ...props });

		return response.status(200).json({
			token,
			user,
		});
	}
}
