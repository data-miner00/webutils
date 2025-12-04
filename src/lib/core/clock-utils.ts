export type CityTimeZone = {
	name: string;
	timezone: string;
	country: string;
};

export const cities: CityTimeZone[] = [
	{ name: 'New York', timezone: 'America/New_York', country: 'USA' },
	{ name: 'London', timezone: 'Europe/London', country: 'UK' },
	{ name: 'Tokyo', timezone: 'Asia/Tokyo', country: 'Japan' },
	{ name: 'Paris', timezone: 'Europe/Paris', country: 'France' },
	{ name: 'Sydney', timezone: 'Australia/Sydney', country: 'Australia' },
	{ name: 'Dubai', timezone: 'Asia/Dubai', country: 'UAE' },
	{ name: 'Singapore', timezone: 'Asia/Singapore', country: 'Singapore' },
	{ name: 'Hong Kong', timezone: 'Asia/Hong_Kong', country: 'China' },
	{ name: 'Los Angeles', timezone: 'America/Los_Angeles', country: 'USA' },
	{ name: 'Chicago', timezone: 'America/Chicago', country: 'USA' },
	{ name: 'Toronto', timezone: 'America/Toronto', country: 'Canada' },
	{ name: 'Berlin', timezone: 'Europe/Berlin', country: 'Germany' },
	{ name: 'Moscow', timezone: 'Europe/Moscow', country: 'Russia' },
	{ name: 'Mumbai', timezone: 'Asia/Kolkata', country: 'India' },
	{ name: 'Shanghai', timezone: 'Asia/Shanghai', country: 'China' },
	{ name: 'São Paulo', timezone: 'America/Sao_Paulo', country: 'Brazil' },
	{ name: 'Mexico City', timezone: 'America/Mexico_City', country: 'Mexico' },
	{ name: 'Seoul', timezone: 'Asia/Seoul', country: 'South Korea' },
	{ name: 'Bangkok', timezone: 'Asia/Bangkok', country: 'Thailand' },
	{ name: 'Istanbul', timezone: 'Europe/Istanbul', country: 'Turkey' },
	{ name: 'Amsterdam', timezone: 'Europe/Amsterdam', country: 'Netherlands' },
	{ name: 'Madrid', timezone: 'Europe/Madrid', country: 'Spain' },
	{ name: 'Rome', timezone: 'Europe/Rome', country: 'Italy' },
	{ name: 'Zurich', timezone: 'Europe/Zurich', country: 'Switzerland' },
	{ name: 'Stockholm', timezone: 'Europe/Stockholm', country: 'Sweden' },
	{ name: 'Cairo', timezone: 'Africa/Cairo', country: 'Egypt' },
	{ name: 'Johannesburg', timezone: 'Africa/Johannesburg', country: 'South Africa' },
	{ name: 'Auckland', timezone: 'Pacific/Auckland', country: 'New Zealand' },
	{ name: 'Vancouver', timezone: 'America/Vancouver', country: 'Canada' },
	{ name: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires', country: 'Argentina' }
];

export function isDaytime(timezone: string): boolean {
	const now = new Date();
	const hour = parseInt(
		now.toLocaleTimeString('en-US', {
			timeZone: timezone,
			hour: '2-digit',
			hour12: false
		})
	);
	return hour >= 6 && hour < 18;
}

export type DayNightDisplay = {
	icon: string;
	text: string;
};

export function getDayNightDisplay(timezone: string): DayNightDisplay {
	const isDay = isDaytime(timezone);
	return {
		icon: isDay ? '☀️' : '🌙',
		text: isDay ? 'Day' : 'Night'
	};
}

export function getTimeDifference(targetTimezone: string): string {
	const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const now = new Date();
	const localOffset = now.getTimezoneOffset();

	const localTime = new Date(now.toLocaleString('en-US', { timeZone: localTimezone }));
	const targetTime = new Date(now.toLocaleString('en-US', { timeZone: targetTimezone }));

	const diffMs = (targetTime as unknown as number) - (localTime as unknown as number);
	const diffHours = Math.round(diffMs / (1000 * 60 * 60));

	if (diffHours === 0) return 'Same time';
	const sign = diffHours > 0 ? '+' : '';
	return `${sign}${diffHours} hours`;
}
