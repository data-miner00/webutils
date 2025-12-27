export function convertCelciusToFarenheit(celcius: number): number {
	return celcius * (9 / 5) + 32;
}

export function convertCelciusToKelvin(celcius: number): number {
	return celcius + 273.15;
}

export function convertFarenheitToCelcius(farenheit: number): number {
	return (farenheit - 32) * (5 / 9);
}

export function convertFarenheitToKelvin(farenheit: number): number {
	return (farenheit - 32) * (5 / 9) + 273.15;
}

export function convertKelvinToCelcius(kelvin: number): number {
	return kelvin - 273.15;
}

export function convertKelvinToFarenheit(kelvin: number): number {
	return (kelvin - 273.15) * (9 / 5) + 32;
}
