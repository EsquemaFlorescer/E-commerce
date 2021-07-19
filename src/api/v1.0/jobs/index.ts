import Queue from 'bull';

export { RegistrationMail } from './RegistrationMail';
export { ActivationMail } from './ActivationMail';

export type DataType = {
	user: {
		name: string;
		email: string;
	};
	token?: string;
};

export type JobsTypes = 'RegistrationMail' | 'ActivationMail' | 'Order';
export type JobsData = DataType;
export type JobsOptions = Queue.JobOptions;

export type Job<T> = {
	key: JobsTypes;
	options: JobsOptions;
	handle: Queue.ProcessCallbackFunction<T>;
};
