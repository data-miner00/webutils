export type UnitCategory =
	| 'temperature'
	| 'length'
	| 'weight'
	| 'volume'
	| 'area'
	| 'speed'
	| 'time'
	| 'digital';

export interface Unit {
	name: string;
	symbol: string;
	toBase: number; // factor to convert to base unit
}

export interface UnitDefinition {
	[key: string]: Unit;
}

export const UNIT_CATEGORIES: Record<
	UnitCategory,
	{ name: string; units: UnitDefinition; baseUnit: string }
> = {
	temperature: {
		name: 'Temperature',
		baseUnit: 'celsius',
		units: {
			celsius: { name: 'Celsius', symbol: '°C', toBase: 1 },
			fahrenheit: { name: 'Fahrenheit', symbol: '°F', toBase: 1 },
			kelvin: { name: 'Kelvin', symbol: 'K', toBase: 1 }
		}
	},
	length: {
		name: 'Length',
		baseUnit: 'meter',
		units: {
			millimeter: { name: 'Millimeter', symbol: 'mm', toBase: 0.001 },
			centimeter: { name: 'Centimeter', symbol: 'cm', toBase: 0.01 },
			meter: { name: 'Meter', symbol: 'm', toBase: 1 },
			kilometer: { name: 'Kilometer', symbol: 'km', toBase: 1000 },
			inch: { name: 'Inch', symbol: 'in', toBase: 0.0254 },
			foot: { name: 'Foot', symbol: 'ft', toBase: 0.3048 },
			yard: { name: 'Yard', symbol: 'yd', toBase: 0.9144 },
			mile: { name: 'Mile', symbol: 'mi', toBase: 1609.344 }
		}
	},
	weight: {
		name: 'Weight',
		baseUnit: 'kilogram',
		units: {
			milligram: { name: 'Milligram', symbol: 'mg', toBase: 0.000001 },
			gram: { name: 'Gram', symbol: 'g', toBase: 0.001 },
			kilogram: { name: 'Kilogram', symbol: 'kg', toBase: 1 },
			ounce: { name: 'Ounce', symbol: 'oz', toBase: 0.0283495 },
			pound: { name: 'Pound', symbol: 'lb', toBase: 0.453592 },
			ton: { name: 'Ton', symbol: 'ton', toBase: 1000 }
		}
	},
	volume: {
		name: 'Volume',
		baseUnit: 'liter',
		units: {
			milliliter: { name: 'Milliliter', symbol: 'ml', toBase: 0.001 },
			liter: { name: 'Liter', symbol: 'L', toBase: 1 },
			fluid_ounce: { name: 'Fluid Ounce', symbol: 'fl oz', toBase: 0.0295735 },
			cup: { name: 'Cup', symbol: 'cup', toBase: 0.236588 },
			pint: { name: 'Pint', symbol: 'pt', toBase: 0.473176 },
			quart: { name: 'Quart', symbol: 'qt', toBase: 0.946353 },
			gallon: { name: 'Gallon', symbol: 'gal', toBase: 3.78541 }
		}
	},
	area: {
		name: 'Area',
		baseUnit: 'square_meter',
		units: {
			square_millimeter: { name: 'Square Millimeter', symbol: 'mm²', toBase: 0.000001 },
			square_centimeter: { name: 'Square Centimeter', symbol: 'cm²', toBase: 0.0001 },
			square_meter: { name: 'Square Meter', symbol: 'm²', toBase: 1 },
			square_kilometer: { name: 'Square Kilometer', symbol: 'km²', toBase: 1000000 },
			square_inch: { name: 'Square Inch', symbol: 'in²', toBase: 0.00064516 },
			square_foot: { name: 'Square Foot', symbol: 'ft²', toBase: 0.092903 },
			square_yard: { name: 'Square Yard', symbol: 'yd²', toBase: 0.836127 },
			square_mile: { name: 'Square Mile', symbol: 'mi²', toBase: 2589988.11 },
			acre: { name: 'Acre', symbol: 'ac', toBase: 4046.86 },
			hectare: { name: 'Hectare', symbol: 'ha', toBase: 10000 }
		}
	},
	speed: {
		name: 'Speed',
		baseUnit: 'meter_per_second',
		units: {
			meter_per_second: { name: 'Meter per Second', symbol: 'm/s', toBase: 1 },
			kilometer_per_hour: { name: 'Kilometer per Hour', symbol: 'km/h', toBase: 1 / 3.6 },
			mile_per_hour: { name: 'Mile per Hour', symbol: 'mph', toBase: 1 / 2.23694 },
			knot: { name: 'Knot', symbol: 'kn', toBase: 1 / 1.94384 },
			foot_per_second: { name: 'Foot per Second', symbol: 'ft/s', toBase: 0.3048 }
		}
	},
	time: {
		name: 'Time',
		baseUnit: 'second',
		units: {
			nanosecond: { name: 'Nanosecond', symbol: 'ns', toBase: 0.000000001 },
			microsecond: { name: 'Microsecond', symbol: 'μs', toBase: 0.000001 },
			millisecond: { name: 'Millisecond', symbol: 'ms', toBase: 0.001 },
			second: { name: 'Second', symbol: 's', toBase: 1 },
			minute: { name: 'Minute', symbol: 'min', toBase: 60 },
			hour: { name: 'Hour', symbol: 'h', toBase: 3600 },
			day: { name: 'Day', symbol: 'd', toBase: 86400 },
			week: { name: 'Week', symbol: 'wk', toBase: 604800 },
			month: { name: 'Month', symbol: 'mo', toBase: 2629746 }, // average month
			year: { name: 'Year', symbol: 'yr', toBase: 31556952 } // average year
		}
	},
	digital: {
		name: 'Digital Storage',
		baseUnit: 'byte',
		units: {
			bit: { name: 'Bit', symbol: 'bit', toBase: 1 / 8 },
			byte: { name: 'Byte', symbol: 'B', toBase: 1 },
			kilobyte: { name: 'Kilobyte', symbol: 'KB', toBase: 1000 },
			megabyte: { name: 'Megabyte', symbol: 'MB', toBase: 1000000 },
			gigabyte: { name: 'Gigabyte', symbol: 'GB', toBase: 1000000000 },
			terabyte: { name: 'Terabyte', symbol: 'TB', toBase: 1000000000000 },
			kibibyte: { name: 'Kibibyte', symbol: 'KiB', toBase: 1024 },
			mebibyte: { name: 'Mebibyte', symbol: 'MiB', toBase: 1048576 },
			gibibyte: { name: 'Gibibyte', symbol: 'GiB', toBase: 1073741824 },
			tebibyte: { name: 'Tebibyte', symbol: 'TiB', toBase: 1099511627776 }
		}
	}
};

export function convertTemperature(value: number, from: string, to: string): number {
	let celsius: number;

	// Convert to Celsius first
	switch (from) {
		case 'celsius':
			celsius = value;
			break;
		case 'fahrenheit':
			celsius = (value - 32) * (5 / 9);
			break;
		case 'kelvin':
			celsius = value - 273.15;
			break;
		default:
			return value;
	}

	// Convert from Celsius to target
	switch (to) {
		case 'celsius':
			return celsius;
		case 'fahrenheit':
			return celsius * (9 / 5) + 32;
		case 'kelvin':
			return celsius + 273.15;
		default:
			return celsius;
	}
}

export function convertUnit(
	value: number,
	from: string,
	to: string,
	category: UnitCategory
): number {
	if (category === 'temperature') {
		return convertTemperature(value, from, to);
	}

	const cat = UNIT_CATEGORIES[category];
	if (!cat) return value;

	const fromUnit = cat.units[from];
	const toUnit = cat.units[to];

	if (!fromUnit || !toUnit) return value;

	// Convert to base unit, then to target unit
	const baseValue = value * fromUnit.toBase;
	return baseValue / toUnit.toBase;
}

export function formatNumber(value: number, decimals: number = 6): string {
	if (value === 0) return '0';

	const absValue = Math.abs(value);
	if (absValue >= 1e6 || absValue < 1e-3) {
		return value.toExponential(3);
	}

	return value.toFixed(decimals).replace(/\.?0+$/, '');
}
