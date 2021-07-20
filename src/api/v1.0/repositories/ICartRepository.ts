import { Cart } from '@prisma/client';

type listType = {
	user_id?: string;
	item_id?: number;
};

export interface ICartRepository {
	list({ user_id, item_id }: listType): Promise<Cart[]>;
	save(user_id: string, item_id: number): Promise<void>;
	delete(user_id: string, id?: number): Promise<void>;
}
