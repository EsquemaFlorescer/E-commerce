import { v4 as uuid } from 'uuid';

import { User } from '.';

interface IAddress {
	email: string;
	name: string;
}

export class Mail {
	public id: string;
	public to: IAddress;
	public subject: string;
	public body: string;
	public user: User;

	constructor(props: Omit<Mail, 'id' | 'user'>, user?: User) {
		Object.assign(this, props);

		this.id = uuid();

		if (user) {
			this.user = user;
		}
		/* put it in queue in here!!!! */
	}
}
