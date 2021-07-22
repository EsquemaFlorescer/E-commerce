import { Request } from 'express';

import { ICouponRepository } from '@v1/repositories';
import { SqliteCouponRepository } from '@v1/repositories/implementations';

class CreateCouponService {
	constructor(private couponRepository: ICouponRepository) {}

	async execute(item_id: number, { query }: Request) {
		try {
			const id = Number(query.id);

			await this.couponRepository.delete(id, item_id);
		} catch (error) {
			throw new Error(error.message);
		}
	}
}

export default async (request: Request) => {
	const couponRepository = new SqliteCouponRepository();
	const CreateCoupon = new CreateCouponService(couponRepository);

	await CreateCoupon.execute(Number(request.params.id), request.body);

	return {
		status: 200,
		message: 'Deleted coupon with success!',
	};
};
