import { MailTrapMailProvider } from '@v1/providers/implementations';
const mailProvider = new MailTrapMailProvider();

import { Job, DataType } from '@v1/jobs';
export const DeletionMail: Job<DataType> = {
	key: 'DeletionMail',
	options: {
		attempts: 1,
	},
	handle: async ({ data }) => {
		const { user } = data;

		await mailProvider.sendMail({
			to: {
				name: user.name,
				email: user.email,
			},

			subject: `Goodbye from NeoExpensive ${user.name}!`,
			body: `We're so sad to see you go ${user.name}...`,
		});
	},
};
