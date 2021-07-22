import { Request } from 'express';

import { ICouponRepository } from '@v1/repositories';
import { SqliteCouponRepository } from '@v1/repositories/implementations';

import { Coupon } from '@v1/entities';

class CreateCouponService {
	constructor(private couponRepository: ICouponRepository) {}

	async execute(item_id: number, { query }: Request) {
		try {
			const id = Number(query.id);
			const code = String(query.code);

			const idSearch = !!id;
			const codeSearch = !!code;
			const item_idSearch = !!item_id;

			if (idSearch) {
				return await this.couponRepository.findById(id);
			}

			if (codeSearch) {
				return await this.couponRepository.findByCode(code);
			}

			if (item_idSearch) {
				return await this.couponRepository.findByItemId(item_id);
			}

			if (idSearch && item_idSearch) {
				return await this.couponRepository.list({ id, item_id });
			}

			return await this.couponRepository.listAll();
		} catch (error) {
			throw new Error(error.message);
		}
	}
}

export default async (request: Request) => {
	const couponRepository = new SqliteCouponRepository();
	const CreateCoupon = new CreateCouponService(couponRepository);

	const coupon = await CreateCoupon.execute(Number(request.params.id), request);

	return {
		status: 200,
		coupon,
		message: 'Created coupon with success!',
	};
};
