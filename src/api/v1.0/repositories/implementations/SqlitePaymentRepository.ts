import { IPaymentRepository } from '@v1/repositories';
import { Payment } from '@v1/entities';

import { prisma } from '@src/prisma';

export class SqlitePaymentRepository implements IPaymentRepository {
	async save(payment: Payment): Promise<void> {
		const { user_id, card, method } = payment;
		const { brand, code, month, year, number } = card;

		await prisma.payment.create({
			data: {
				user_id,
				method,
				card_brand: brand,
				card_code: code,
				card_month: month,
				card_number: number,
				card_year: year,
			},
		});
	}

	async delete(id: number): Promise<void> {
		await prisma.payment.delete({
			where: {
				id,
			},
		});
	}
}
