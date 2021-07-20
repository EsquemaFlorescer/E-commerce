import { Request } from 'express';

import { ICartRepository, IItemsRepository } from '@v1/repositories';
import { SqliteCartRepository, SqliteItemsRepository } from '@v1/repositories/implementations';

class CheckoutService {
	constructor(private itemsRepository: IItemsRepository, private cartRepository: ICartRepository) {}

	async execute(id: string, { query }: Request) {
		try {
			const singleItem = query.singleItem;
			const item_id = query.item_id;

			if (!!singleItem === true) {
				const item = await this.itemsRepository.findById(Number(item_id));

				if (!item) throw new Error("This item doesn't exist.");
				const percentagePrice = Math.floor(item.discount / 100);

				if (percentagePrice === 0) {
					const price: number = item.price + item.shipping_price;
					return {
						prices: price,
					};
				} else {
					const price: number = item.price - percentagePrice * (item.price + item.shipping_price);
					return {
						price,
					};
				}
			}

			// get user address and use it on frete API, get the shipping price and add on the item price
			const cart = await this.cartRepository.list({ user_id: id });

			if (cart.length === 0) throw new Error('Your cart is empty.');
			var itemPrices: number[] = [];

			for (const { item_id } of cart) {
				try {
					const item = await this.itemsRepository.findById(item_id);

					if (!item) throw new Error('Item on your cart is no longer valid.');
					const percentagePrice = Math.floor(item.discount / 100);

					if (percentagePrice === 0) {
						const price: number = item.price + item.shipping_price;
						itemPrices.push(price);
					} else {
						const price: number = item.price - percentagePrice * (item.price + item.shipping_price);
						itemPrices.push(price);
					}
				} catch (error) {
					throw new Error(error.message);
				}
			}

			await this.cartRepository.delete(id);

			const add = (a: number, b: number) => a + b;
			const prices = itemPrices.reduce(add);

			return {
				prices,
			};
		} catch (error) {
			throw new Error(error.message);
		}
	}
}

export default async (request: Request) => {
	try {
		const usersRepository = new SqliteItemsRepository();
		const cartRepository = new SqliteCartRepository();

		const checkout = new CheckoutService(usersRepository, cartRepository);

		const { prices } = await checkout.execute(request.params.id, request);

		return {
			status: 200,
			message: 'Checkout successful!',
			prices,
		};
	} catch (error) {
		return {
			status: 400,
			error: true,
			message: error.message,
		};
	}
};
