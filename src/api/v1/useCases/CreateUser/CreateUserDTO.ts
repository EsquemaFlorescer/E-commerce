export interface ICreateUserRequestDTO {
	name: string;
	email: string;
	password: string;
	isHash?: boolean;
}

export interface ICreateUserResponseDTO {
	token: string;
	user: ICreateUserRequestDTO;
}
