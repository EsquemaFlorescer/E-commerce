import { writeFileSync, readFileSync } from 'fs';
import ips from '../../ips.json';

type ApiResponse = {
	status: number;
	body: {
		message: string;
	};
};

export const IPTest = () => {
	it('should be IP banned in user routes', async () => {
		const newIps = ['127.0.0.1'];

		ips.forEach(ip => {
			newIps.push(ip);
		});
		writeFileSync('./src/ips.json', JSON.stringify(newIps));
		writeFileSync('./src/ips.json', JSON.stringify(ips));
		/**
		 * Need to find a way to change supertest request IP so I can see if API really blocks it
		 * 1. change whats written inside ips.json with node.js so the ip is blocked temporarily
		 */
	});
};
