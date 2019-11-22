import { ask } from './cli';
import { boldGrey } from './colors';

export const getInputName = () => ask('Enter the name of the video file: ');
export const getSoundSpeed = () => ask(`Enter the speed for frames with sound ${boldGrey('(default: 1)')}: `);
export const getSilenceSpeed = () => ask(`Enter the speed for frames with silence ${boldGrey('(default: 1000)')}: `);
export const getSilentThreshold = () => ask(`Enter silent threshold ${boldGrey('(default: 0.04)')}: `);
export const getFrameMargin = () => ask(`Enter frame margin: ${boldGrey('(default: 2)')}: `);
export const getFrameRate = () => () => ask('Enter the input video\'s frame rate: '); 
export const getOutputName = name => ask(`Enter output file name ${boldGrey('(default: ${name}_shotcut)')}:`);