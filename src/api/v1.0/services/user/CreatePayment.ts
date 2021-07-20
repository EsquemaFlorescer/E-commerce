import { Request } from 'express';

import { IPaymentRepository } from '@v1/repositories';
import { SqlitePaymentRepository } from '@v1/repositories/implementations';

import { Payment } from '@v1/entities';

class CreatePaymentService {
	constructor(private paymentRepository: IPaymentRepository) {}

	async execute(user_id: string, { method, card }: Payment) {
		try {
			var payment = new Payment({
				user_id,
				method,
				card,
			});

			await this.paymentRepository.save(payment);

			return {
				payment,
			};
		} catch (error) {
			console.log(error);
			throw new Error(error.message);
		}
	}
}

export default async (request: Request) => {
	try {
		const paymentRepository = new SqlitePaymentRepository();
		const CreatePayment = new CreatePaymentService(paymentRepository);

		const { payment } = await CreatePayment.execute(request.params.id, request.body);

		return {
			status: 201,
			payment,
			message: 'Created a payment method with success!',
		};
	} catch (error) {
		return {
			status: 400,
			error: true,
			message: error.message,
		};
	}
};
