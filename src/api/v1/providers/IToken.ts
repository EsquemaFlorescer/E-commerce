export interface IToken {
	create: (payload: string | object, key: string, expiresIn?: string | number) => string;
}
