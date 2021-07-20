import { MailTrapMailProvider } from '@v1/providers/implementations';
const mailProvider = new MailTrapMailProvider();

import { Job, DataType } from '@v1/jobs';
export const ForgotPasswordMail: Job<DataType> = {
	key: 'ForgotPasswordMail',
	options: {
		attempts: 5,
	},
	handle: async ({ data }) => {
		const { user, token } = data;

		await mailProvider.sendMail({
			to: {
				name: user.name,
				email: user.email,
			},
			subject: 'Forgot password.',
			body: `<p>You forgot your password? No trouble, use this token:\n ${token}</p>`,
		});
	},
};
