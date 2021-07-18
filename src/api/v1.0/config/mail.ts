export const MailConfig = {
	config: {
		host: process.env.MAIL_HOST,
		port: process.env.MAIL_PORT,

		auth: {
			user: process.env.MAIL_USER,
			pass: process.env.MAIL_PASS,
		},
	},

	from: {
		name: process.env.MAIL_SENDER_NAME!,
		address: process.env.MAIL_SENDER_EMAIL!,
	},
};
