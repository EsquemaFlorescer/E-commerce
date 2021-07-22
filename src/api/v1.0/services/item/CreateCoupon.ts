import { Request } from 'express';

import { ICouponRepository } from '@v1/repositories';
import { SqliteCouponRepository } from '@v1/repositories/implementations';

import { Coupon } from '@v1/entities';

class CreateCouponService {
	constructor(private couponRepository: ICouponRepository) {}

	async execute(item_id: number, { expire_date, code, value }: Coupon) {
		try {
			const coupon = new Coupon({ expire_date, code, item_id, value });

			await this.couponRepository.save(coupon);

			return {
				coupon,
			};
		} catch (error) {
			throw new Error(error.message);
		}
	}
}

export default async (request: Request) => {
	const couponRepository = new SqliteCouponRepository();
	const CreateCoupon = new CreateCouponService(couponRepository);

	const { coupon } = await CreateCoupon.execute(Number(request.params.id), request.body);

	return {
		status: 200,
		coupon,
		message: 'Created coupon with success!',
	};
};
