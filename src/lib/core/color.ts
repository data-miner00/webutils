import Color, { type ColorInstance } from 'color';

interface ColorOutput {
	hex: string;
	rgb: string;
	hsl: string;
	hsv: string;
	hwb: string;
	cmyk: string;
}

export function parseColor(color: string) {
	let colorValue: string | number[] = color.trim();
	let model: 'hsv' | 'cmyk' | undefined = undefined;

	if (colorValue.includes('hsv')) {
		colorValue = colorValue
			.slice(4, -1)
			.split(',')
			.map((number) => parseFloat(number.trim()));
		model = 'hsv';
	} else if (colorValue.includes('cmyk')) {
		colorValue = colorValue
			.slice(5, -1)
			.split(',')
			.map((number) => parseFloat(number.trim()));
		model = 'cmyk';
	}

	try {
		return Color(colorValue, model);
	} catch (err) {
		return null;
	}
}

const defaultOutput: ColorOutput = {
	hex: '',
	rgb: '',
	hsl: '',
	hsv: '',
	hwb: '',
	cmyk: ''
};

export function colorOutput(colorObject: ColorInstance | null) {
	if (!colorObject) return defaultOutput;

	const hsv = colorObject.hsv();
	const cmyk = colorObject.cmyk();

	return {
		hex: colorObject.alpha() === 1 ? colorObject.hex() : colorObject.hexa(),
		rgb: colorObject.rgb().toString(),
		hsl: colorObject.hsl().toString(),
		// @ts-expect-error Types incorrect
		hsv: `hsv(${Math.round(hsv.color[0])}, ${Math.round(hsv.color[1] * 10) / 10}%, ${Math.round(hsv.color[2] * 10) / 10}%${hsv.valpha < 1 ? `, ${hsv.valpha}` : ''})`,
		hwb: colorObject.hwb().toString(),
		// @ts-expect-error Types incorrect
		cmyk: `cmyk(${Math.round(cmyk.color[0])}%, ${Math.round(cmyk.color[1] * 10) / 10}%, ${Math.round(cmyk.color[2] * 10) / 10}%, ${Math.round(cmyk.color[3] * 10) / 10}%${cmyk.valpha < 1 ? `, ${cmyk.valpha}` : ''})`
	};
}
