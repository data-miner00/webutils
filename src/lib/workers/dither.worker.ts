import { type DitherAlgorithm, type Rgb, ditherPixels } from '$lib/core/dither';

export type DitherRequest = {
	id: number;
	width: number;
	height: number;
	buffer: ArrayBuffer;
	palette: Rgb[];
	algorithm: DitherAlgorithm;
};

export type DitherResponse = {
	id: number;
	width: number;
	height: number;
	buffer: ArrayBuffer;
};

self.onmessage = (event: MessageEvent<DitherRequest>) => {
	const { id, width, height, buffer, palette, algorithm } = event.data;
	const result = ditherPixels(
		{ data: new Uint8ClampedArray(buffer), width, height },
		palette,
		algorithm
	);
	const response: DitherResponse = { id, width, height, buffer: result.data.buffer as ArrayBuffer };

	self.postMessage(response, { transfer: [response.buffer] });
};
