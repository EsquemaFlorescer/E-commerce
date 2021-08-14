import Frete from 'frete';

import { Order } from '@v1/entities';
import { Dimension } from '@prisma/client';

import { SqliteItemsRepository, SqliteOrderRepository } from '@v1/repositories/implementations';
import { MailTrapMailProvider } from '@v1/providers/implementations';

const itemsRepository = new SqliteItemsRepository();
const orderRepository = new SqliteOrderRepository();
const mailProvider = new MailTrapMailProvider();

type itemResponse = {
	id: number;
	created_at: number;
	name: string;
	brand: string | null;
	short_name: string;
	description: string;
	price: number;
	shipping_price: number;
	discount: number;
	category: string;
	dimension?: Dimension;
};

type FreteResponse = {
	codigo: number;
	valor: string;
	prazoEntrega: string;
	valorMaoPropria: string;
	valorAvisoRecebimento: string;
	valorValorDeclarado: string;
	entregaDomiciliar: 'S' | 'N';
	entregaSabado: 'S' | 'N';
	erro: string;
	msgErro: string;
	valorSemAdicionais: string;
	obsFim: string;
	name: string;
};

import { Job, DataType } from '@v1/jobs';
export const SingleOrder: Job<DataType> = {
	key: 'SingleOrder',
	options: {
		priority: 7,
		attempts: 1,
	},
	handle: async ({ data }) => {
		const { checkout } = data;
		const { discount, item_id, postal_code, ...props } = checkout!;

		const item: itemResponse = await itemsRepository.findById(item_id);
		if (!item) throw new Error("This item doesn't exist.");
		const [{ valor, prazoEntrega }]: FreteResponse[] = await Frete()
			.cepOrigem('02228240')
			.cepDestino(postal_code)
			.peso(item.dimension?.weight!)
			.formato(Frete.formatos.caixaPacote)
			.comprimento(item.dimension?.length!)
			.altura(item.dimension?.height!)
			.largura(item.dimension?.width!)
			.diametro(item.dimension?.diameter!)
			.maoPropria('N')
			.valorDeclarado(item.price / 100)
			.avisoRecebimento('S')
			.servico(Frete.servicos.sedex)
			.precoPrazo('13466321'); // 01/01/1970;

		const shipping_price = Number(valor.split(',').join(''));

		let date = new Date();
		date.setDate(date.getDate() + Number(prazoEntrega));

		const percentagePrice = Math.floor(discount / 100);

		if (percentagePrice === 0) {
			const order = new Order({
				...props,
				item_id,
				shipping_price,
				all_items_price: item.price,
			});

			await orderRepository.save(order);

			return {
				prices: {
					price: item.price,
					discount: `${discount}%`,
					shipping: {
						shipping_price,
						shipping_date: date.getTime(),
					},
				},
			};
		}

		const price = item.price - percentagePrice * item.price;

		const order = new Order({
			...props,
			item_id,
			shipping_price,
			all_items_price: price,
		});

		await orderRepository.save(order);

		return {
			prices: {
				price,
				discount: `${discount}%`,
				shipping: {
					shipping_price,
					shipping_date: date.getTime(),
				},
			},
		};
	},
};
