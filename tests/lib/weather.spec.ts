import {
	convertCelciusToFarenheit,
	convertCelciusToKelvin,
	convertFarenheitToCelcius,
	convertFarenheitToKelvin,
	convertKelvinToCelcius,
	convertKelvinToFarenheit
} from '$lib/core/weather';

describe('weather conversions', () => {
	describe('convertCelciusToFarenheit', () => {
		it('converts 0°C to 32°F', () => {
			expect(convertCelciusToFarenheit(0)).toBeCloseTo(32, 5);
		});

		it('converts 100°C to 212°F', () => {
			expect(convertCelciusToFarenheit(100)).toBeCloseTo(212, 5);
		});

		it('converts -40°C to -40°F', () => {
			expect(convertCelciusToFarenheit(-40)).toBeCloseTo(-40, 5);
		});
	});

	describe('convertCelciusToKelvin', () => {
		it('converts 0°C to 273.15K', () => {
			expect(convertCelciusToKelvin(0)).toBeCloseTo(273.15, 5);
		});

		it('converts -273.15°C to 0K', () => {
			expect(convertCelciusToKelvin(-273.15)).toBeCloseTo(0, 5);
		});
	});

	describe('convertFarenheitToCelcius', () => {
		it('converts 32°F to 0°C', () => {
			expect(convertFarenheitToCelcius(32)).toBeCloseTo(0, 5);
		});

		it('converts 212°F to 100°C', () => {
			expect(convertFarenheitToCelcius(212)).toBeCloseTo(100, 5);
		});

		it('converts -40°F to -40°C', () => {
			expect(convertFarenheitToCelcius(-40)).toBeCloseTo(-40, 5);
		});
	});

	describe('convertFarenheitToKelvin', () => {
		it('converts 32°F to 273.15K', () => {
			expect(convertFarenheitToKelvin(32)).toBeCloseTo(273.15, 4);
		});

		it('converts -459.67°F to 0K (absolute zero)', () => {
			expect(convertFarenheitToKelvin(-459.67)).toBeCloseTo(0, 2);
		});
	});

	describe('convertKelvinToCelcius', () => {
		it('converts 273.15K to 0°C', () => {
			expect(convertKelvinToCelcius(273.15)).toBeCloseTo(0, 5);
		});

		it('converts 0K to -273.15°C', () => {
			expect(convertKelvinToCelcius(0)).toBeCloseTo(-273.15, 5);
		});
	});

	describe('convertKelvinToFarenheit', () => {
		it('converts 273.15K to 32°F', () => {
			expect(convertKelvinToFarenheit(273.15)).toBeCloseTo(32, 4);
		});

		it('converts 0K to about -459.67°F', () => {
			expect(convertKelvinToFarenheit(0)).toBeCloseTo(-459.67, 2);
		});
	});
});
