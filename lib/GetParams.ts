import * as fs from 'fs';
import * as path from 'path';
import { ask } from './CLI';
import { boldRed, grey } from './Colors';
import { SOUND_SPEED, SILENCE_SPEED, SILENT_THRESHOLD, FRAME_MARGIN } from '../config';

function isNumeric(val, callback, defValue) {
	if (isNaN(val)) {
		console.log(boldRed('Expected a number but got a string instead.'));
		return callback();
	}
	return val === '' ? defValue : Number(val);
}

export const getInputName = async () => {
	let name = await ask('Enter the name of the video file: ');
	if (!fs.existsSync(path.join(__dirname, name as string)) || name === '') {
		console.log(path.join(__dirname, name as string));
		console.log(boldRed('No file with this name exists!'));
		return getInputName();
	}
	return name;
};

export const getSoundSpeed = async () => {
	let soundSpeed = await ask(
		`Enter the speed for frames with sound ${grey(`(default: ${SOUND_SPEED})`)}: `
	);
	return isNumeric(soundSpeed, getSoundSpeed, SOUND_SPEED);
};

export const getSilenceSpeed = async () => {
	let silenceSpeed = await ask(
		`Enter the speed for frames with silence ${grey(`(default: ${SILENCE_SPEED})`)}: `
	);
	return isNumeric(silenceSpeed, getSilenceSpeed, SILENCE_SPEED);
};

export const getSilentThreshold = async () => {
	let silentThreshold = await ask(
		`Enter silent threshold ${grey(`(default: ${SILENT_THRESHOLD})`)}: `
	);
	return isNumeric(silentThreshold, getSilentThreshold, SILENT_THRESHOLD);
};

export const getFrameMargin = async () => {
	let frameMargin = await ask(`Enter frame margin ${grey(`(default: ${FRAME_MARGIN})`)}: `);
	return isNumeric(frameMargin, getFrameMargin, FRAME_MARGIN);
};

export const getFrameRate = async fr => {
	let frameRate = await ask(`Enter the input video's frame rate ${grey(`(default: ${fr})`)}: `);
	return isNumeric(frameRate, getFrameRate, fr);
};

export const getOutputName = async name => {
	let outputName = await ask(`Enter output file name ${grey(`(default: ${name}_shotcut)`)}: `);
	if (outputName === name) {
		console.log(boldRed('Output file name cannot be same as input file name'));
		return getOutputName(name);
	}
	return outputName.toString();
};
