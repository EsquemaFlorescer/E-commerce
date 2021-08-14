export class Payment {
	public readonly user_id: string;

	public method: 'cash' | 'debit' | 'credit' | 'boleto';
	public card: {
		brand: 'visa' | 'mastercard';
		number: string;
		month: string;
		year: string;
		code: string;
	};

	constructor(props: Payment) {
		Object.assign(this, props);
	}
}
