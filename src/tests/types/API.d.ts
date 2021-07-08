export interface ApiResponse<T> {
	status: number;
	headers: {
		authorization: string;
	};
	body: {
		message: string;
		access_token: string;
		refresh_token: string;
		user: T;
		users: T;
		jwt_login: boolean;
	};
}
