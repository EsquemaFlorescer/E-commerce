import { IMessage, IMailProvider } from '../IMailProvider';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { MailConfig } from '@v1/config/mail';

export class MailTrapMailProvider implements IMailProvider {
	private transporter: Mail;

	constructor() {
		const { config } = MailConfig;
		this.transporter = nodemailer.createTransport(config as SMTPTransport.Options);
	}

	async sendMail(message: IMessage): Promise<void> {
		const { from } = MailConfig;

		console.log({
			to: {
				name: message.to.name,
				address: message.to.email,
			},
			from,
			subject: message.subject,
			html: message.body,
		});
	}
}
