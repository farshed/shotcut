import * as util from 'util';
export const exec = util.promisify(require('child_process').exec);

const rl = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});

export const ask = (q: string) => new Promise(resolve => rl.question(q, ans => resolve(ans)));

export const terminate = () => {
	rl.close();
	process.exit(0);
};
