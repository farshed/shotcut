import fs from 'fs';
import path from 'path';
import { ask } from './CLI';
import { boldRed, boldGrey } from './Colors';

export const getInputName = async () => {
	let name = await ask('Enter the name of the video file: ');
	if (!fs.existsSync(path.join(__dirname, name.toString()))) {
		console.log(boldRed('No file with this name exists!'));
		return getInputName();
	}
	return name;
};

export const getSoundSpeed = async () => {
	let soundSpeed = await ask(
		`Enter the speed for frames with sound ${boldGrey('(default: 1)')}: `
	);
	if (typeof soundSpeed !== 'number') {
		console.log(boldRed('Sound speed should be a number'));
		return getSoundSpeed();
	}
	return soundSpeed;
};

export const getSilenceSpeed = async () => {
	let silenceSpeed = await ask(
		`Enter the speed for frames with silence ${boldGrey('(default: 1000)')}: `
	);
	if (typeof silenceSpeed !== 'number') {
		console.log(boldRed('Silence speed should be a number'));
		return getSilenceSpeed();
	}
	return silenceSpeed;
};
export const getSilentThreshold = async () => {
	let silentThreshold = await ask(`Enter silent threshold ${boldGrey('(default: 0.04)')}: `);
	if (typeof silentThreshold !== 'number') {
		console.log(boldRed('Silent threshold should be a number'));
		return getSilentThreshold();
	}
	return silentThreshold;
};
export const getFrameMargin = async () => {
	let frameMargin = await ask(`Enter frame margin: ${boldGrey('(default: 2)')}: `);
	if (typeof frameMargin !== 'number') {
		console.log(boldRed('Frame margin should be a number'));
		return getFrameMargin();
	}
	return frameMargin;
};
export const getFrameRate = async () => {
	let frameRate = await ask("Enter the input video's frame rate: ");
	if (typeof frameRate !== 'number') {
		console.log(boldRed('Frame rate should be a number'));
		return getFrameRate();
	}
	return frameRate;
};
export const getOutputName = async name => {
	let outputName = ask(`Enter output file name ${boldGrey('(default: ${name}_shotcut)')}:`);
	if (outputName === name) {
		console.log(boldRed('Output file name cannot be same as input file name'));
		return getOutputName(name);
	}
	return outputName.toString();
};
