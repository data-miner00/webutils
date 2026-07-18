export type Weather = {
	temperature: number; // in Celsius
	feelsLike: number; // in Celsius
	humidity: number; // in %
	windSpeed: number; // in km/h
	weatherCode: number;
	description: string; // e.g., "Clear sky"
	isDay: boolean;
};

export type GeocodingResult = {
	name: string;
	country: string;
	admin1?: string;
	latitude: number;
	longitude: number;
};

// WMO Weather interpretation codes, as used by Open-Meteo.
const WEATHER_CODE_DESCRIPTIONS: Record<number, string> = {
	0: 'Clear sky',
	1: 'Mainly clear',
	2: 'Partly cloudy',
	3: 'Overcast',
	45: 'Fog',
	48: 'Depositing rime fog',
	51: 'Light drizzle',
	53: 'Moderate drizzle',
	55: 'Dense drizzle',
	56: 'Light freezing drizzle',
	57: 'Dense freezing drizzle',
	61: 'Slight rain',
	63: 'Moderate rain',
	65: 'Heavy rain',
	66: 'Light freezing rain',
	67: 'Heavy freezing rain',
	71: 'Slight snow fall',
	73: 'Moderate snow fall',
	75: 'Heavy snow fall',
	77: 'Snow grains',
	80: 'Slight rain showers',
	81: 'Moderate rain showers',
	82: 'Violent rain showers',
	85: 'Slight snow showers',
	86: 'Heavy snow showers',
	95: 'Thunderstorm',
	96: 'Thunderstorm with slight hail',
	99: 'Thunderstorm with heavy hail'
};

export function describeWeatherCode(code: number): string {
	return WEATHER_CODE_DESCRIPTIONS[code] ?? 'Unknown';
}

type GeocodingApiResponse = {
	results?: {
		name: string;
		country: string;
		admin1?: string;
		latitude: number;
		longitude: number;
	}[];
};

// Open-Meteo geocoding API: free, no API key required.
export async function searchLocations(query: string): Promise<GeocodingResult[]> {
	const trimmed = query.trim();
	if (!trimmed) return [];

	const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
	url.searchParams.set('name', trimmed);
	url.searchParams.set('count', '5');
	url.searchParams.set('language', 'en');
	url.searchParams.set('format', 'json');

	const response = await fetch(url);
	if (!response.ok) throw new Error(`Location search failed (${response.status})`);

	const body = (await response.json()) as GeocodingApiResponse;
	return (body.results ?? []).map((result) => ({
		name: result.name,
		country: result.country,
		admin1: result.admin1,
		latitude: result.latitude,
		longitude: result.longitude
	}));
}

type ForecastApiResponse = {
	current: {
		temperature_2m: number;
		apparent_temperature: number;
		relative_humidity_2m: number;
		wind_speed_10m: number;
		weather_code: number;
		is_day: number;
	};
};

// Open-Meteo forecast API: free, no API key required.
export async function fetchWeatherByCoordinates(
	latitude: number,
	longitude: number
): Promise<Weather> {
	const url = new URL('https://api.open-meteo.com/v1/forecast');
	url.searchParams.set('latitude', latitude.toString());
	url.searchParams.set('longitude', longitude.toString());
	url.searchParams.set(
		'current',
		'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day'
	);

	const response = await fetch(url);
	if (!response.ok) throw new Error(`Weather lookup failed (${response.status})`);

	const body = (await response.json()) as ForecastApiResponse;
	const current = body.current;

	return {
		temperature: current.temperature_2m,
		feelsLike: current.apparent_temperature,
		humidity: current.relative_humidity_2m,
		windSpeed: current.wind_speed_10m,
		weatherCode: current.weather_code,
		description: describeWeatherCode(current.weather_code),
		isDay: current.is_day === 1
	};
}

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
