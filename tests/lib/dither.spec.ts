import {
	type Pixels,
	type Rgb,
	bayerMatrix,
	ditherAlgorithms,
	ditherPixels,
	extractPalette,
	hexToRgb,
	palettePresets,
	parseHexPalette,
	rgbToHex
} from '$lib/core/dither';

const BLACK_WHITE: Rgb[] = [
	[0, 0, 0],
	[255, 255, 255]
];

function solidImage(width: number, height: number, rgba: number[]): Pixels {
	const data = new Uint8ClampedArray(width * height * 4);
	for (let index = 0; index < data.length; index += 4) {
		data.set(rgba, index);
	}
	return { data, width, height };
}

function gradientImage(): Pixels {
	const width = 64;
	const height = 16;
	const data = new Uint8ClampedArray(width * height * 4);
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			data.set([x * 4, y * 16, 128, 255], (y * width + x) * 4);
		}
	}
	return { data, width, height };
}

function colorsIn({ data }: Pixels): Set<string> {
	const colors = new Set<string>();
	for (let index = 0; index < data.length; index += 4) {
		colors.add(rgbToHex([data[index], data[index + 1], data[index + 2]]));
	}
	return colors;
}

function whiteRatio({ data }: Pixels): number {
	let white = 0;
	for (let index = 0; index < data.length; index += 4) {
		if (data[index] === 255) white++;
	}
	return white / (data.length / 4);
}

describe('bayerMatrix', () => {
	it('should build the 2×2 and 4×4 matrices', () => {
		expect(bayerMatrix(2)).toEqual([
			[0, 2],
			[3, 1]
		]);
		expect(bayerMatrix(4)).toEqual([
			[0, 8, 2, 10],
			[12, 4, 14, 6],
			[3, 11, 1, 9],
			[15, 7, 13, 5]
		]);
	});

	it.each([2, 4, 8])('should use every threshold once in the %i×%i matrix', (size) => {
		const values = bayerMatrix(size)
			.flat()
			.sort((a, b) => a - b);
		expect(values).toEqual(Array.from({ length: size * size }, (_, index) => index));
	});
});

describe('ditherPixels', () => {
	it('should snap to the nearest color without dithering', () => {
		const result = ditherPixels(solidImage(2, 2, [40, 40, 40, 255]), BLACK_WHITE, 'none');
		expect([...colorsIn(result)]).toEqual(['#000000']);
	});

	it('should turn 50% gray into the Bayer 4×4 pattern', () => {
		const matrix = bayerMatrix(4);
		const { data } = ditherPixels(solidImage(8, 8, [128, 128, 128, 255]), BLACK_WHITE, 'bayer-4');

		for (let y = 0; y < 8; y++) {
			for (let x = 0; x < 8; x++) {
				const expected = matrix[y % 4][x % 4] >= 8 ? 255 : 0;
				expect(data[(y * 8 + x) * 4]).toBe(expected);
			}
		}
	});

	it('should turn 50% gray into about half white pixels with Floyd–Steinberg', () => {
		const result = ditherPixels(
			solidImage(32, 32, [128, 128, 128, 255]),
			BLACK_WHITE,
			'floyd-steinberg'
		);
		expect(whiteRatio(result)).toBeGreaterThan(0.45);
		expect(whiteRatio(result)).toBeLessThan(0.55);
	});

	it.each(ditherAlgorithms.map((algorithm) => algorithm.id))(
		'should only output palette colors with %s',
		(algorithm) => {
			const pico8 = palettePresets.find((preset) => preset.id === 'pico-8')!.colors;
			const result = ditherPixels(gradientImage(), pico8.map(hexToRgb), algorithm);

			for (const color of colorsIn(result)) {
				expect(pico8).toContain(color);
			}
		}
	);

	it.each(ditherAlgorithms.map((algorithm) => algorithm.id))(
		'should be deterministic and leave the input unchanged with %s',
		(algorithm) => {
			const image = gradientImage();
			const original = new Uint8ClampedArray(image.data);

			const first = ditherPixels(image, BLACK_WHITE, algorithm);
			const second = ditherPixels(image, BLACK_WHITE, algorithm);

			expect(first.data).toEqual(second.data);
			expect(image.data).toEqual(original);
		}
	);

	it.each(ditherAlgorithms.map((algorithm) => algorithm.id))(
		'should leave transparent pixels unchanged with %s',
		(algorithm) => {
			const image = solidImage(4, 4, [200, 10, 10, 0]);
			expect(ditherPixels(image, BLACK_WHITE, algorithm).data).toEqual(image.data);
		}
	);

	it('should throw for an empty palette', () => {
		expect(() => ditherPixels(solidImage(1, 1, [0, 0, 0, 255]), [], 'none')).toThrow(
			'Palette is empty'
		);
	});
});

describe('parseHexPalette', () => {
	it('should accept short and long hex colors separated by commas or spaces', () => {
		expect(parseHexPalette('#000, #FFFFFF\n#ff0000')).toEqual([
			[0, 0, 0],
			[255, 255, 255],
			[255, 0, 0]
		]);
	});

	it('should name the invalid colors', () => {
		expect(() => parseHexPalette('#000 nope #12345')).toThrow('Invalid colors: nope, #12345');
	});

	it('should need at least 2 colors', () => {
		expect(() => parseHexPalette('#000')).toThrow('Enter at least 2 colors');
	});
});

describe('hexToRgb and rgbToHex', () => {
	it('should convert between hex and RGB', () => {
		expect(hexToRgb('#8bac0f')).toEqual([139, 172, 15]);
		expect(rgbToHex([139, 172, 15])).toBe('#8bac0f');
	});
});

describe('extractPalette', () => {
	it('should return the exact colors of an image with fewer colors than asked for', () => {
		const image = solidImage(10, 10, [0, 0, 0, 255]);
		// Make 10% of the image red
		for (let pixel = 0; pixel < 10; pixel++) {
			image.data.set([255, 0, 0, 255], pixel * 4);
		}

		const palette = extractPalette(image, 8);
		expect(palette).toHaveLength(2);
		expect(palette).toEqual(
			expect.arrayContaining([
				[0, 0, 0],
				[255, 0, 0]
			])
		);
	});

	it('should never return more colors than asked for', () => {
		expect(extractPalette(gradientImage(), 4)).toHaveLength(4);
	});

	it('should ignore transparent pixels', () => {
		expect(extractPalette(solidImage(4, 4, [255, 0, 0, 0]), 4)).toEqual([]);
	});
});
