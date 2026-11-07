export type Rgb = [number, number, number];

// Compatible with ImageData, so the same functions run in the browser and in tests
export type Pixels = {
	data: Uint8ClampedArray;
	width: number;
	height: number;
};

type DiffusionKernel = {
	divisor: number;
	// [dx, dy, weight] for each neighbour ahead of the current pixel
	offsets: [number, number, number][];
};

const DIFFUSION_KERNELS = {
	'floyd-steinberg': {
		divisor: 16,
		offsets: [
			[1, 0, 7],
			[-1, 1, 3],
			[0, 1, 5],
			[1, 1, 1]
		]
	},
	// Atkinson only spreads 6/8 of the error, which keeps highlights and shadows crisp
	atkinson: {
		divisor: 8,
		offsets: [
			[1, 0, 1],
			[2, 0, 1],
			[-1, 1, 1],
			[0, 1, 1],
			[1, 1, 1],
			[0, 2, 1]
		]
	},
	'jarvis-judice-ninke': {
		divisor: 48,
		offsets: [
			[1, 0, 7],
			[2, 0, 5],
			[-2, 1, 3],
			[-1, 1, 5],
			[0, 1, 7],
			[1, 1, 5],
			[2, 1, 3],
			[-2, 2, 1],
			[-1, 2, 3],
			[0, 2, 5],
			[1, 2, 3],
			[2, 2, 1]
		]
	},
	stucki: {
		divisor: 42,
		offsets: [
			[1, 0, 8],
			[2, 0, 4],
			[-2, 1, 2],
			[-1, 1, 4],
			[0, 1, 8],
			[1, 1, 4],
			[2, 1, 2],
			[-2, 2, 1],
			[-1, 2, 2],
			[0, 2, 4],
			[1, 2, 2],
			[2, 2, 1]
		]
	},
	burkes: {
		divisor: 32,
		offsets: [
			[1, 0, 8],
			[2, 0, 4],
			[-2, 1, 2],
			[-1, 1, 4],
			[0, 1, 8],
			[1, 1, 4],
			[2, 1, 2]
		]
	},
	sierra: {
		divisor: 32,
		offsets: [
			[1, 0, 5],
			[2, 0, 3],
			[-2, 1, 2],
			[-1, 1, 4],
			[0, 1, 5],
			[1, 1, 4],
			[2, 1, 2],
			[-1, 2, 2],
			[0, 2, 3],
			[1, 2, 2]
		]
	},
	'two-row-sierra': {
		divisor: 16,
		offsets: [
			[1, 0, 4],
			[2, 0, 3],
			[-2, 1, 1],
			[-1, 1, 2],
			[0, 1, 3],
			[1, 1, 2],
			[2, 1, 1]
		]
	},
	'sierra-lite': {
		divisor: 4,
		offsets: [
			[1, 0, 2],
			[-1, 1, 1],
			[0, 1, 1]
		]
	}
} satisfies Record<string, DiffusionKernel>;

const BAYER_SIZES = { 'bayer-2': 2, 'bayer-4': 4, 'bayer-8': 8 };

type OrderedAlgorithm = keyof typeof BAYER_SIZES;
type ErrorDiffusionAlgorithm = keyof typeof DIFFUSION_KERNELS;

export type DitherAlgorithm = 'none' | OrderedAlgorithm | ErrorDiffusionAlgorithm;

export const ditherAlgorithms: { id: DitherAlgorithm; name: string; group: string }[] = [
	{ id: 'none', name: 'None (nearest color)', group: 'None' },
	{ id: 'bayer-2', name: 'Bayer 2×2', group: 'Ordered' },
	{ id: 'bayer-4', name: 'Bayer 4×4', group: 'Ordered' },
	{ id: 'bayer-8', name: 'Bayer 8×8', group: 'Ordered' },
	{ id: 'floyd-steinberg', name: 'Floyd–Steinberg', group: 'Error diffusion' },
	{ id: 'atkinson', name: 'Atkinson', group: 'Error diffusion' },
	{ id: 'jarvis-judice-ninke', name: 'Jarvis–Judice–Ninke', group: 'Error diffusion' },
	{ id: 'stucki', name: 'Stucki', group: 'Error diffusion' },
	{ id: 'burkes', name: 'Burkes', group: 'Error diffusion' },
	{ id: 'sierra', name: 'Sierra', group: 'Error diffusion' },
	{ id: 'two-row-sierra', name: 'Two-row Sierra', group: 'Error diffusion' },
	{ id: 'sierra-lite', name: 'Sierra Lite', group: 'Error diffusion' }
];

export const palettePresets: { id: string; name: string; colors: string[] }[] = [
	{ id: 'black-white', name: 'Black & white', colors: ['#000000', '#ffffff'] },
	{
		id: 'grayscale',
		name: 'Grayscale (4 shades)',
		colors: ['#000000', '#555555', '#aaaaaa', '#ffffff']
	},
	{ id: 'game-boy', name: 'Game Boy', colors: ['#0f380f', '#306230', '#8bac0f', '#9bbc0f'] },
	{ id: 'cga', name: 'CGA', colors: ['#000000', '#55ffff', '#ff55ff', '#ffffff'] },
	{
		id: 'pico-8',
		name: 'PICO-8',
		colors: [
			'#000000',
			'#1d2b53',
			'#7e2553',
			'#008751',
			'#ab5236',
			'#5f574f',
			'#c2c3c7',
			'#fff1e8',
			'#ff004d',
			'#ffa300',
			'#ffec27',
			'#00e436',
			'#29adff',
			'#83769c',
			'#ff77a8',
			'#ffccaa'
		]
	},
	{
		id: 'rgb',
		name: 'RGB primaries',
		colors: ['#000000', '#ff0000', '#00ff00', '#0000ff', '#00ffff', '#ff00ff', '#ffff00', '#ffffff']
	}
];

// Enough samples to find the main colors of a photo without scanning every pixel
const MAX_PALETTE_SAMPLES = 50_000;
const HEX_COLOR = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

export function hexToRgb(hex: string): Rgb {
	let digits = hex.replace('#', '');
	if (digits.length === 3) {
		digits = [...digits].map((digit) => digit + digit).join('');
	}

	const value = parseInt(digits, 16);
	return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

export function rgbToHex(color: Rgb): string {
	return '#' + color.map((channel) => channel.toString(16).padStart(2, '0')).join('');
}

export function parseHexPalette(text: string): Rgb[] {
	const entries = text.split(/[\s,]+/).filter(Boolean);
	const invalid = entries.filter((entry) => !HEX_COLOR.test(entry));

	if (invalid.length) {
		throw new Error(`Invalid colors: ${invalid.join(', ')}`);
	}
	if (entries.length < 2) {
		throw new Error('Enter at least 2 colors');
	}

	return entries.map(hexToRgb);
}

export function bayerMatrix(size: number): number[][] {
	let matrix = [[0]];

	// Each step tiles the matrix into four quadrants offset by 0, 2, 3 and 1
	while (matrix.length < size) {
		const n = matrix.length;
		const previous = matrix;
		matrix = Array.from({ length: n * 2 }, (_, y) =>
			Array.from({ length: n * 2 }, (_, x) => {
				const quadrant = [
					[0, 2],
					[3, 1]
				][Math.floor(y / n)][Math.floor(x / n)];
				return 4 * previous[y % n][x % n] + quadrant;
			})
		);
	}

	return matrix;
}

// Palette channels as separate flat arrays, which keeps the per-pixel color search fast
type PaletteChannels = { reds: number[]; greens: number[]; blues: number[] };

function toChannels(palette: Rgb[]): PaletteChannels {
	return {
		reds: palette.map((color) => color[0]),
		greens: palette.map((color) => color[1]),
		blues: palette.map((color) => color[2])
	};
}

function nearestIndex(r: number, g: number, b: number, { reds, greens, blues }: PaletteChannels) {
	let nearest = 0;
	let nearestDistance = Infinity;

	for (let index = 0; index < reds.length; index++) {
		const dr = r - reds[index];
		const dg = g - greens[index];
		const db = b - blues[index];
		const distance = dr * dr + dg * dg + db * db;

		if (distance < nearestDistance) {
			nearest = index;
			nearestDistance = distance;
		}
	}

	return nearest;
}

// The average gap between neighbouring palette colors, per channel, e.g. 255 for black & white
function orderedSpread(palette: Rgb[]): number {
	const gaps = palette.map((color) =>
		Math.min(
			...palette
				.map((other) => Math.hypot(color[0] - other[0], color[1] - other[1], color[2] - other[2]))
				.filter((distance) => distance > 0)
		)
	);
	const finiteGaps = gaps.filter(Number.isFinite);
	if (!finiteGaps.length) return 0;

	const averageGap = finiteGaps.reduce((sum, gap) => sum + gap, 0) / finiteGaps.length;
	return averageGap / Math.sqrt(3);
}

function writeColor(
	output: Uint8ClampedArray,
	index: number,
	colorIndex: number,
	{ reds, greens, blues }: PaletteChannels
) {
	output[index] = reds[colorIndex];
	output[index + 1] = greens[colorIndex];
	output[index + 2] = blues[colorIndex];
}

function nearestColorDither(pixels: Pixels, output: Uint8ClampedArray, palette: Rgb[]) {
	const { data } = pixels;
	const channels = toChannels(palette);

	for (let index = 0; index < data.length; index += 4) {
		if (data[index + 3] === 0) continue;

		const colorIndex = nearestIndex(data[index], data[index + 1], data[index + 2], channels);
		writeColor(output, index, colorIndex, channels);
	}
}

function orderedDither(pixels: Pixels, output: Uint8ClampedArray, palette: Rgb[], size: number) {
	const { data, width, height } = pixels;
	const channels = toChannels(palette);
	const spread = orderedSpread(palette);
	const offsets = bayerMatrix(size).map((row) =>
		row.map((threshold) => ((threshold + 0.5) / (size * size) - 0.5) * spread)
	);

	for (let y = 0; y < height; y++) {
		const rowOffsets = offsets[y % size];

		for (let x = 0; x < width; x++) {
			const index = (y * width + x) * 4;
			if (data[index + 3] === 0) continue;

			const offset = rowOffsets[x % size];
			const colorIndex = nearestIndex(
				data[index] + offset,
				data[index + 1] + offset,
				data[index + 2] + offset,
				channels
			);
			writeColor(output, index, colorIndex, channels);
		}
	}
}

function diffuseErrors(
	pixels: Pixels,
	output: Uint8ClampedArray,
	palette: Rgb[],
	kernel: DiffusionKernel
) {
	const { data, width, height } = pixels;
	const channels = toChannels(palette);
	const dxs = kernel.offsets.map(([dx]) => dx);
	const dys = kernel.offsets.map(([, dy]) => dy);
	const shares = kernel.offsets.map(([, , weight]) => weight / kernel.divisor);
	// Errors only travel a couple of rows ahead, so a rolling buffer of rows is enough
	const rowCount = Math.max(...dys) + 1;
	const errors = new Float32Array(rowCount * width * 3);

	for (let y = 0; y < height; y++) {
		const row = (y % rowCount) * width;

		for (let x = 0; x < width; x++) {
			const index = (y * width + x) * 4;
			if (data[index + 3] === 0) continue;

			const slot = (row + x) * 3;
			const r = data[index] + errors[slot];
			const g = data[index + 1] + errors[slot + 1];
			const b = data[index + 2] + errors[slot + 2];
			const colorIndex = nearestIndex(r, g, b, channels);
			writeColor(output, index, colorIndex, channels);

			const errorR = r - channels.reds[colorIndex];
			const errorG = g - channels.greens[colorIndex];
			const errorB = b - channels.blues[colorIndex];

			for (let k = 0; k < shares.length; k++) {
				const nx = x + dxs[k];
				const ny = y + dys[k];
				if (nx < 0 || nx >= width || ny >= height) continue;
				if (data[(ny * width + nx) * 4 + 3] === 0) continue;

				const target = ((ny % rowCount) * width + nx) * 3;
				errors[target] += errorR * shares[k];
				errors[target + 1] += errorG * shares[k];
				errors[target + 2] += errorB * shares[k];
			}
		}

		// Clear this row's errors so the slot can be reused for a row further down
		errors.fill(0, row * 3, (row + width) * 3);
	}
}

export function ditherPixels(pixels: Pixels, palette: Rgb[], algorithm: DitherAlgorithm): Pixels {
	if (!palette.length) {
		throw new Error('Palette is empty');
	}

	const { data, width, height } = pixels;
	const output = new Uint8ClampedArray(data);

	if (algorithm === 'none') {
		nearestColorDither(pixels, output, palette);
	} else if (algorithm in BAYER_SIZES) {
		orderedDither(pixels, output, palette, BAYER_SIZES[algorithm as OrderedAlgorithm]);
	} else {
		diffuseErrors(pixels, output, palette, DIFFUSION_KERNELS[algorithm as ErrorDiffusionAlgorithm]);
	}

	return { data: output, width, height };
}

function averageColor(colors: Rgb[]): Rgb {
	const sum = colors.reduce<Rgb>(
		(total, color) => [total[0] + color[0], total[1] + color[1], total[2] + color[2]],
		[0, 0, 0]
	);
	return sum.map((channel) => Math.round(channel / colors.length)) as Rgb;
}

// Median cut: keep splitting the box of colors with the widest channel range until there are enough
export function extractPalette(pixels: Pixels, count: number): Rgb[] {
	const { data } = pixels;
	const pixelCount = data.length / 4;
	const step = Math.max(1, Math.floor(pixelCount / MAX_PALETTE_SAMPLES));
	const samples: Rgb[] = [];

	for (let pixel = 0; pixel < pixelCount; pixel += step) {
		const index = pixel * 4;
		if (data[index + 3] > 0) {
			samples.push([data[index], data[index + 1], data[index + 2]]);
		}
	}
	if (!samples.length) return [];

	const boxes: Rgb[][] = [samples];

	while (boxes.length < count) {
		let widestRange = 0;
		let widestBox = 0;
		let widestChannel = 0;

		boxes.forEach((box, boxIndex) => {
			for (let channel = 0; channel < 3; channel++) {
				let min = 255;
				let max = 0;
				for (const color of box) {
					min = Math.min(min, color[channel]);
					max = Math.max(max, color[channel]);
				}
				if (max - min > widestRange) {
					widestRange = max - min;
					widestBox = boxIndex;
					widestChannel = channel;
				}
			}
		});

		// Every box holds a single color, so there's nothing left to split
		if (widestRange === 0) break;

		const box = [...boxes[widestBox]].sort((a, b) => a[widestChannel] - b[widestChannel]);
		const median = box[Math.floor(box.length / 2)][widestChannel];
		// Keep equal values together, so an image with few colors gets exactly those colors
		let split = box.findIndex((color) => color[widestChannel] >= median);
		if (split === 0) {
			split = box.findIndex((color) => color[widestChannel] > median);
		}

		boxes.splice(widestBox, 1, box.slice(0, split), box.slice(split));
	}

	return boxes.map(averageColor);
}
