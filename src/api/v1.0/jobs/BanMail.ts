import { MailTrapMailProvider } from '@v1/providers/implementations';
const mailProvider = new MailTrapMailProvider();

import { Job, DataType } from '@v1/jobs';
export const BanMail: Job<DataType> = {
	key: 'BanMail',
	options: {
		attempts: 3,
	},
	handle: async ({ data }) => {
		const { user, admin_user } = data;

		await mailProvider.sendMail({
			to: {
				name: user.name,
				email: user.email,
			},
			subject: `You're banned ${user.name}!`,
			body: `
					<p>
						${user.name} you were banned by admin <strong>${admin_user?.name}</strong>:<br>
						reason: ${user.reason_for_ban}
					</p>
				`,
		});
	},
};
