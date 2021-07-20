import { Request } from 'express';

import { ICartRepository, IItemsRepository, IOrderRepository } from '@v1/repositories';
import {
	SqliteCartRepository,
	SqliteItemsRepository,
	SqliteOrderRepository,
} from '@v1/repositories/implementations';

import { Order } from '@v1/entities';

class CheckoutService {
	constructor(
		private itemsRepository: IItemsRepository,
		private cartRepository: ICartRepository,
		private orderRepository: IOrderRepository
	) {}

	async execute(id: string, { query }: Request) {
		try {
			const address_id = Number(query.address_id);
			const payment_id = Number(query.payment_id);
			const item_id = Number(query.item_id);

			if (!!item_id === true) {
				const item = await this.itemsRepository.findById(Number(item_id));

				if (!item) throw new Error("This item doesn't exist.");
				const percentagePrice = Math.floor(item.discount / 100);

				if (percentagePrice === 0) {
					const price: number = item.price + item.shipping_price;

					const order = new Order({
						user_id: id,
						address_id,
						item_id,
						payment_id,
						// frete API
						shipping_price: item.shipping_price,
						all_items_price: price,
					});

					await this.orderRepository.save(order);

					return {
						prices: price,
					};
				}

				const price: number = item.price - percentagePrice * (item.price + item.shipping_price);

				const order = new Order({
					user_id: id,
					address_id,
					item_id,
					payment_id,
					// frete API
					shipping_price: item.shipping_price,
					all_items_price: price,
				});

				await this.orderRepository.save(order);

				return {
					prices: price,
				};
			}

			// get user address and use it on frete API, get the shipping price and add on the item price
			const cart = await this.cartRepository.list({ user_id: id });

			if (cart.length === 0) throw new Error('Your cart is empty.');
			var itemPrices: number[] = [];
			var itemShipping: number[] = [];

			for (const { item_id } of cart) {
				try {
					const item = await this.itemsRepository.findById(item_id);

					if (!item) throw new Error('Item on your cart is no longer valid.');
					const percentagePrice = Math.floor(item.discount / 100);

					if (percentagePrice === 0) {
						itemShipping.push(item.shipping_price);
						itemPrices.push(item.price);
					} else {
						const price: number = item.price - percentagePrice * item.price;
						itemPrices.push(item.shipping_price);
						itemPrices.push(price);
					}
				} catch (error) {
					throw new Error(error.message);
				}
			}

			await this.cartRepository.delete(id);

			const add = (a: number, b: number) => a + b;
			const prices = itemPrices.reduce(add);
			const shipping = itemShipping.reduce(add);
			// validate if address, payment or item id exist
			const order = new Order({
				user_id: id,
				address_id,
				item_id,
				payment_id,
				// frete API
				shipping_price: shipping,
				all_items_price: prices,
			});

			await this.orderRepository.save(order);

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
		const orderRepository = new SqliteOrderRepository();

		const checkout = new CheckoutService(usersRepository, cartRepository, orderRepository);

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
