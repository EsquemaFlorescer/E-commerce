import Queue from 'bull';

export { RegistrationMail } from './RegistrationMail';
export { ActivationMail } from './ActivationMail';
export { BanMail } from './BanMail';
export { DeletionMail } from './DeletionMail';
export { ForgotPasswordMail } from './ForgotPasswordMail';
export { FailedLoginMail } from './FailedLoginMail';

export type DataType = {
	user: {
		name: string;
		email: string;
		ip?: string;
		failed_attemps?: number;
		reason_for_ban?: string;
	};
	admin_user?: {
		name?: string;
	};
	token?: string;
};

export type JobsTypes =
	| 'RegistrationMail'
	| 'ActivationMail'
	| 'Order'
	| 'BanMail'
	| 'DeletionMail'
	| 'ForgotPasswordMail'
	| 'NewDeviceMail'
	| 'FailedLoginMail';
export type JobsData = DataType;
export type JobsOptions = Queue.JobOptions;

export type Job<T> = {
	key: JobsTypes;
	options?: JobsOptions;
	handle: Queue.ProcessCallbackFunction<T>;
};
