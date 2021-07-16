import request from 'supertest';
import { app } from '@src/app';

import { clear } from '@tests/v1/clear';
import { ApiResponse } from '@tests/types/API';
import { Item } from '@v1/entities';

describe('Read item', () => {
	var itemInfo = {
		id: '',
	};

	const itemDTO = {
		name: 'test jest',
		short_name: 'test',
		description: 'test jest testing tests',
		category: 'tests',
		discount: 0,
		price: 1000,
		shipping_price: 100,
		image: [],
	};

	it('should get item information', async () => {
		await request(app).post('/v1/item').send(itemDTO);
		const { status, body }: ApiResponse<any[]> = await request(app).get('/v1/item');
		expect(status).toBe(202);

		itemInfo.id = body.items[0].id;
	});

	it('should rate an item', async () => {
		const { status, body }: ApiResponse<Item> = await request(app)
			.post(`/v1/item/rate/${itemInfo.id}`)
			.send({
				one_star: 0,
				two_star: 0,
				three_star: 0,
				four_star: 0,
				five_star: 1,
			});

		expect(status).toBe(200);

		expect(body.message).toBe('Rated item with success!');
		expect(body.item).toBeTruthy();
	});

	it('should list item rating', async () => {
		const { status }: ApiResponse<Item> = await request(app).get(`/v1/item/${itemInfo.id}`);

		expect(status).toBe(202);
	});

	beforeAll(async () => await clear());
});
