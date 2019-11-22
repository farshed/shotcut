import { exec, ask, terminate } from '../lib/CLI';
import { boldRed } from '../lib/Colors';
import * as q from '../lib/GetParams';
const { version } = require('../package.json');

const SOUND_THRESHOLD = 0.04;

console.log(`Shotcut v${version}`);

let obj = {};

(async function shotCutter() {
	try {
		let inputName = await q.getInputName();
		let soundSpeed = await q.getSoundSpeed();
		let silenceSpeed = await q.getSilenceSpeed();
		let silentThreshold = await q.getSilentThreshold();
		let frameMargin = await q.getFrameMargin();
		let frameRate = q.getFrameRate();
		let outputName = q.getOutputName(inputName);
	} catch (e) {
		console.log(boldRed(e));
	}
})();
