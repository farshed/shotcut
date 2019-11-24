import * as path from 'path';
import * as fs from 'fs';
const { AudioContext } = require('web-audio-api');
const context = new AudioContext();
const toWav = require('audiobuffer-to-wav');
const createBuffer = require('audio-buffer-from');
import { exec, ask, terminate } from '../lib/CLI';
import { boldRed, bold } from '../lib/Colors';
import * as q from '../lib/GetParams';
const { version } = require('../package.json');

let pcmData = [];
let sampleCount = 0;
let duration = 0;
let frameRate = 0;
let soundSpeed = 0;
let silenceSpeed = 0;
let silentThreshold;
let frameMargin = 0;
let inputName = '';
let outputName = '';
const frameQuality = 3;
const sampleRate = 44100;
const tempDir = path.join(__dirname, 'TEMP');

console.log(`${bold('Shotcut')} v${version}`);

(async function shotCutter() {
	try {
		await getInput();
		if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
		console.log('splitting frames');
		//prettier-ignore
		// await exec(`ffmpeg -i ${inputName} -qscale:v ${frameQuality.toString()} ${path.join(temp, 'frame%06d.jpg')} -hide_banner`);
		console.log('splitting audio');
		await exec(
			`ffmpeg -i ${inputName} -ab 160k -ac 2 -ar ${sampleRate} -vn ${tempDir}/audio_temp.wav`
		);
		processAudio();
	} catch (e) {
		console.log(boldRed(e));
	}
})();

async function getInput() {
	inputName = await q.getInputName();
	let { stdout } = await exec(
		`ffprobe -v error -select_streams v -of default=noprint_wrappers=1:nokey=1 -show_entries stream=r_frame_rate ${inputName}`
	);
	let [nom, denom] = stdout.split('/');
	frameRate = nom / denom;
	soundSpeed = await q.getSoundSpeed();
	silenceSpeed = await q.getSilenceSpeed();
	silentThreshold = await q.getSilentThreshold();
	frameMargin = await q.getFrameMargin();
	outputName = await q.getOutputName(inputName);
}
//prettier-ignore
async function processAudio() {
	const buffer = fs.readFileSync(path.join('TEMP', 'audio_temp.wav'));
	const decoder = buf =>
		new Promise(resolve => context.decodeAudioData(buf, outBuf => resolve(outBuf)));
	const audioBuffer: any = await decoder(buffer);
	sampleCount = audioBuffer.length;
	duration = audioBuffer.duration;
	pcmData = audioBuffer.getChannelData(0);

	// let interval = 0.05 * 1000;
	// let index, max, prevMax;
	// index = max = prevMax = 0;
	// let step = Math.round(sampleRate * (interval / 1000));

	// let sampleInterval = setInterval(() => {
	// 	if (index >= pcmData.length) {
	// 		clearInterval(sampleInterval);
	// 		return console.log('Sampling done!');
	// 	}
	// 	for (let i = index; i < index + step; i++) {
	// 		max = pcmData[i] > max ? pcmData[i].toFixed(2) : max;
	// 	}
	// 	console.log(max);
	// 	prevMax = max;
	// 	max = 0;
	// 	index += step;
	// }, interval);
	let maxAudioVolume = getMaxVolume(pcmData);
	let samplesPerFrame = sampleRate / frameRate;
	let audioFrameCount = Math.ceil(sampleCount / samplesPerFrame);
	let loudnessMap = Array(audioFrameCount).fill(0);
	
	for (let i = 0; i < audioFrameCount; i++) {
		let start = i * samplesPerFrame;
		let end = Math.min(Math.round((i + 1) * samplesPerFrame), sampleCount);
		let audioChunks = pcmData.slice(start, end);
		let maxChunksVolume = (getMaxVolume(audioChunks) / maxAudioVolume).toFixed(2);
		if (maxChunksVolume >= silentThreshold) loudnessMap[i] = 1;
	}
	
	let chunks = [[0, 0, 0]];
	let includedFramesMap = Array(audioFrameCount).fill(0);
	for (let i = 0; i < audioFrameCount; i++) {
		let start = Math.round(Math.max(0, i - frameMargin));
		let end = Math.round(Math.min(audioFrameCount, i + 1 + frameMargin));
		includedFramesMap[i] = loudnessMap.slice(start, end).reduce((a, b) => Math.max(a, b)).toFixed(2);
		if (i >= 1 && includedFramesMap[i] != includedFramesMap[i - 1])
			chunks.push([chunks[chunks.length - 1][1], i, includedFramesMap[i - 1]]);
	}
	chunks.push([chunks[chunks.length - 1][1], audioFrameCount, includedFramesMap[audioFrameCount-1]])
	chunks = chunks.slice(1);

	for (let i = 0; i < chunks.length; i++) {
		let chunk = pcmData.slice(chunks[i][0]*samplesPerFrame, chunks[i][1]*samplesPerFrame);
		let sFile = path.join(tempDir, 'audio_temp_s.wav');
		let eFile = path.join(tempDir, 'audio_temp_w.wav');
		let wavForm = toWav(createBuffer(chunk));
    let chunkToWrite = new Buffer(new Uint8Array(wavForm));
    fs.appendFile(sFile, chunkToWrite, console.log);
	}
    
    // wavfile.write(sFile,SAMPLE_RATE,audioChunk)
    with WavReader(sFile) as reader:
        with WavWriter(eFile, reader.channels, reader.samplerate) as writer:
            tsm = phasevocoder(reader.channels, speed=NEW_SPEED[int(chunk[2])])
            tsm.run(reader, writer)
    _, alteredAudioData = wavfile.read(eFile)
    leng = alteredAudioData.shape[0]
    endPointer = outputPointer+leng
    outputAudioData = np.concatenate((outputAudioData,alteredAudioData/maxAudioVolume))
}

function getMaxVolume(arr) {
	let maxV = arr.reduce((a, b) => Math.max(a, b)).toFixed(2);
	let minV = arr.reduce((a, b) => Math.max(a, b)).toFixed(2);
	return Math.max(maxV, -minV);
}