import { Mail } from '@v1/entities';

export interface IMailProvider {
	sendMail(mail: Mail): Promise<void>;
}
