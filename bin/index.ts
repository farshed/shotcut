import fs from 'fs';
import path from 'path';
import { exec, ask, terminate } from '../lib/cli';
import { boldRed } from '../lib/colors';
import * as q from '../lib/questions';
import { checkType } from '../lib/vibecheck';
const { version } = require('../package.json');

const SOUND_THRESHOLD = 0.04;

console.log(`Shotcut v${version}`);

let obj = {};

(async function shotCutter() {
	try {
		let name = await q.getInputName();
		if (!fs.existsSync(path.join(__dirname, name.toString())))
			throw 'No file with this name exists!';
		// let soundSpeed: number = await q.getSoundSpeed();
	} catch (e) {
		console.log(boldRed(e));
		shotCutter();
	}
})();
