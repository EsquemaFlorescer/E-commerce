import { Mail } from '@v1/entities';
import { IMailProvider } from '../IMailProvider';
import nodemailer from 'nodemailer';
import MailAPI from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { MailConfig } from '@v1/config/mail';

export class MailTrapMailProvider implements IMailProvider {
	private transporter: MailAPI;

	constructor() {
		const { config } = MailConfig;
		this.transporter = nodemailer.createTransport(config as SMTPTransport.Options);
	}

	async sendMail(mail: Mail): Promise<void> {
		const { body, subject, to } = mail;
		const { from } = MailConfig;
		console.log({
			mail,
		});
		// this.transporter.sendMail({
		// 	to: {
		// 		name: to.name,
		// 		address: to.email,
		// 	},
		// 	from,
		// 	subject,
		// 	html: body,
		// });
	}
}
