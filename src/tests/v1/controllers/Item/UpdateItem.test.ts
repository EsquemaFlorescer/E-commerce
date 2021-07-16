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

	it('should update item', async () => {
		const { status, body }: ApiResponse<Item> = await request(app)
			.patch(`/v1/item/${itemInfo.id}`)
			.send({
				name: 'jest test',
				short_name: 'jest',
				description: 'jest tests my code',
				category: 'software',
				discount: 0,
				price: 1000,
				shipping_price: 100,
			});

		expect(status).toBe(202);
		expect(body).toBeTruthy();

		expect(body.message).toBe('Updated item with success!');
		expect(body.item.name).not.toBe(itemDTO.name);
		expect(body.item.short_name).not.toBe(itemDTO.short_name);
		expect(body.item.description).not.toBe(itemDTO.description);
		expect(body.item.category).not.toBe(itemDTO.category);
	});

	beforeAll(async () => await clear());
});
