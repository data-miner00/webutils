export type CronFieldName = 'minute' | 'hour' | 'dayOfMonth' | 'month' | 'dayOfWeek';

export type CronField = {
	raw: string;
	values: number[];
};

export type CronSchedule = Record<CronFieldName, CronField>;

export type CronTimezone = 'local' | 'utc';

type CronFieldSpec = {
	name: CronFieldName;
	label: string;
	allowed: string;
	min: number;
	max: number;
	names?: string[];
};

type Range = {
	start: number;
	end: number;
	step: number;
};

type Cursor = {
	year: number;
	month: number;
	day: number;
	hour: number;
	minute: number;
};

const monthNames = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const cronFields: CronFieldSpec[] = [
	{ name: 'minute', label: 'minute', allowed: '0-59', min: 0, max: 59 },
	{ name: 'hour', label: 'hour', allowed: '0-23', min: 0, max: 23 },
	{ name: 'dayOfMonth', label: 'day-of-month', allowed: '1-31', min: 1, max: 31 },
	{ name: 'month', label: 'month', allowed: '1-12, JAN-DEC', min: 1, max: 12, names: monthNames },
	// 7 is accepted as an alias for Sunday
	{
		name: 'dayOfWeek',
		label: 'day-of-week',
		allowed: '0-7, SUN-SAT',
		min: 0,
		max: 7,
		names: dayNames
	}
];

const macros: Record<string, string> = {
	'@yearly': '0 0 1 1 *',
	'@annually': '0 0 1 1 *',
	'@monthly': '0 0 1 * *',
	'@weekly': '0 0 * * 0',
	'@daily': '0 0 * * *',
	'@midnight': '0 0 * * *',
	'@hourly': '0 * * * *'
};

export const cronExamples = [
	{ title: 'Every minute', expression: '* * * * *' },
	{ title: 'Every 5 minutes', expression: '*/5 * * * *' },
	{ title: 'Every hour', expression: '0 * * * *' },
	{ title: 'Every day at midnight', expression: '0 0 * * *' },
	{ title: 'Weekdays at 09:30', expression: '30 9 * * MON-FRI' },
	{ title: 'First day of every month', expression: '0 0 1 * *' },
	{ title: 'Every 6 hours on weekends', expression: '0 */6 * * SAT,SUN' }
];

// How far ahead to search before giving up: "0 0 30 2 *" never runs, and "0 0 29 2 *" can be
// 8 years apart when a leap year is skipped (e.g. 2100)
const SEARCH_YEARS = 10;

function parseValue(text: string, spec: CronFieldSpec): number {
	const nameIndex =
		spec.names?.findIndex((name) => name.slice(0, 3).toUpperCase() === text.toUpperCase()) ?? -1;

	if (nameIndex >= 0) return nameIndex + spec.min;

	if (!/^\d+$/.test(text)) {
		throw new Error(`Invalid ${spec.label} value "${text}"`);
	}

	const value = Number(text);
	if (value < spec.min || value > spec.max) {
		throw new Error(
			`Invalid ${spec.label} value "${text}": must be between ${spec.min} and ${spec.max}`
		);
	}

	return value;
}

function parsePart(part: string, spec: CronFieldSpec): Range {
	const [rangeText, stepText, ...extraSteps] = part.split('/');
	if (extraSteps.length) {
		throw new Error(`Invalid ${spec.label} "${part}"`);
	}

	let step = 1;
	if (stepText !== undefined) {
		step = Number(stepText);
		if (!/^\d+$/.test(stepText) || step < 1) {
			throw new Error(`Invalid ${spec.label} step "${stepText}": must be a positive number`);
		}
	}

	if (rangeText === '*') {
		return { start: spec.min, end: spec.max, step };
	}

	const [startText, endText, ...extraBounds] = rangeText.split('-');
	if (extraBounds.length) {
		throw new Error(`Invalid ${spec.label} range "${rangeText}"`);
	}

	const start = parseValue(startText, spec);
	if (endText === undefined) {
		// "5/15" is shorthand for "5-<max>/15"
		return { start, end: stepText === undefined ? start : spec.max, step };
	}

	const end = parseValue(endText, spec);
	if (start > end) {
		throw new Error(`Invalid ${spec.label} range "${rangeText}": start is greater than end`);
	}

	return { start, end, step };
}

function parseField(raw: string, spec: CronFieldSpec): CronField {
	const values = new Set<number>();

	for (const part of raw.split(',')) {
		const { start, end, step } = parsePart(part, spec);
		for (let value = start; value <= end; value += step) {
			values.add(spec.name === 'dayOfWeek' ? value % 7 : value);
		}
	}

	return { raw, values: [...values].sort((a, b) => a - b) };
}

export function parseCron(expression: string): CronSchedule {
	const trimmed = expression.trim();
	if (!trimmed) {
		throw new Error('Expression is empty');
	}

	const expanded = trimmed.startsWith('@') ? macros[trimmed.toLowerCase()] : trimmed;
	if (!expanded) {
		throw new Error(`Unsupported macro "${trimmed}"`);
	}

	const parts = expanded.split(/\s+/);
	if (parts.length !== cronFields.length) {
		throw new Error(`Expected ${cronFields.length} fields but got ${parts.length}`);
	}

	const [minute, hour, dayOfMonth, month, dayOfWeek] = cronFields.map((spec, index) =>
		parseField(parts[index], spec)
	);

	return { minute, hour, dayOfMonth, month, dayOfWeek };
}

// Like Vixie cron, a field starting with "*" (including steps like "*/2") counts as unrestricted
function isWildcard(field: CronField): boolean {
	return field.raw.startsWith('*');
}

function ordinal(n: number): string {
	if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;
	return n + (['th', 'st', 'nd', 'rd'][n % 10] ?? 'th');
}

function joinList(items: string[]): string {
	if (items.length <= 1) return items.join('');
	return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

function formatValue(value: number, spec: CronFieldSpec): string {
	return spec.names ? spec.names[(value - spec.min) % spec.names.length] : String(value);
}

function describeField(field: CronField, spec: CronFieldSpec): string {
	const singles: string[] = [];
	const phrases: string[] = [];

	for (const part of field.raw.split(',')) {
		const { start, end, step } = parsePart(part, spec);
		const every = step > 1 ? `every ${ordinal(step)} ${spec.label}` : `every ${spec.label}`;

		if (part.split('/')[0] === '*') {
			phrases.push(every);
		} else if (start === end) {
			singles.push(formatValue(start, spec));
		} else {
			phrases.push(`${every} from ${formatValue(start, spec)} through ${formatValue(end, spec)}`);
		}
	}

	if (singles.length) {
		const list = joinList(singles);
		phrases.unshift(spec.names ? list : `${spec.label} ${list}`);
	}

	return joinList(phrases);
}

function pad(value: number): string {
	return String(value).padStart(2, '0');
}

export function describeCron(schedule: CronSchedule): string {
	const { minute, hour, dayOfMonth, month, dayOfWeek } = schedule;
	const [minuteSpec, hourSpec, dayOfMonthSpec, monthSpec, dayOfWeekSpec] = cronFields;

	let description: string;
	if (/^\d+$/.test(minute.raw) && /^\d+$/.test(hour.raw)) {
		description = `At ${pad(hour.values[0])}:${pad(minute.values[0])}`;
	} else {
		description = `At ${describeField(minute, minuteSpec)}`;
		if (hour.raw !== '*') {
			description += ` past ${describeField(hour, hourSpec)}`;
		}
	}

	if (dayOfMonth.raw !== '*') {
		description += ` on ${describeField(dayOfMonth, dayOfMonthSpec)}`;
	}

	if (dayOfWeek.raw !== '*') {
		if (dayOfMonth.raw === '*') {
			description += ' on';
		} else {
			description += isWildcard(dayOfMonth) || isWildcard(dayOfWeek) ? ' and on' : ' or on';
		}
		description += ` ${describeField(dayOfWeek, dayOfWeekSpec)}`;
	}

	if (month.raw !== '*') {
		description += ` in ${describeField(month, monthSpec)}`;
	}

	return `${description}.`;
}

function daysInMonth(year: number, month: number): number {
	return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function nextMonth(cursor: Cursor) {
	cursor.month++;
	cursor.day = 1;
	cursor.hour = 0;
	cursor.minute = 0;
	if (cursor.month > 12) {
		cursor.year++;
		cursor.month = 1;
	}
}

function nextDay(cursor: Cursor) {
	cursor.day++;
	cursor.hour = 0;
	cursor.minute = 0;
	if (cursor.day > daysInMonth(cursor.year, cursor.month)) {
		nextMonth(cursor);
	}
}

function nextHour(cursor: Cursor) {
	cursor.hour++;
	cursor.minute = 0;
	if (cursor.hour > 23) {
		nextDay(cursor);
	}
}

function nextMinute(cursor: Cursor) {
	cursor.minute++;
	if (cursor.minute > 59) {
		nextHour(cursor);
	}
}

function toCursor(date: Date, timezone: CronTimezone): Cursor {
	return timezone === 'utc'
		? {
				year: date.getUTCFullYear(),
				month: date.getUTCMonth() + 1,
				day: date.getUTCDate(),
				hour: date.getUTCHours(),
				minute: date.getUTCMinutes()
			}
		: {
				year: date.getFullYear(),
				month: date.getMonth() + 1,
				day: date.getDate(),
				hour: date.getHours(),
				minute: date.getMinutes()
			};
}

function toDate({ year, month, day, hour, minute }: Cursor, timezone: CronTimezone): Date {
	return timezone === 'utc'
		? new Date(Date.UTC(year, month - 1, day, hour, minute))
		: new Date(year, month - 1, day, hour, minute);
}

export function getNextRuns(
	schedule: CronSchedule,
	from: Date,
	count: number,
	timezone: CronTimezone = 'local'
): Date[] {
	const minutes = new Set(schedule.minute.values);
	const hours = new Set(schedule.hour.values);
	const daysOfMonth = new Set(schedule.dayOfMonth.values);
	const months = new Set(schedule.month.values);
	const daysOfWeek = new Set(schedule.dayOfWeek.values);

	// Like Vixie cron, when both day fields are restricted a day matches if either one does
	const matchEitherDay = !isWildcard(schedule.dayOfMonth) && !isWildcard(schedule.dayOfWeek);

	function matchesDay({ year, month, day }: Cursor): boolean {
		const isDayOfMonth = daysOfMonth.has(day);
		const isDayOfWeek = daysOfWeek.has(new Date(Date.UTC(year, month - 1, day)).getUTCDay());
		return matchEitherDay ? isDayOfMonth || isDayOfWeek : isDayOfMonth && isDayOfWeek;
	}

	const runs: Date[] = [];
	const cursor = toCursor(from, timezone);
	const lastYear = cursor.year + SEARCH_YEARS;
	nextMinute(cursor);

	while (runs.length < count && cursor.year <= lastYear) {
		if (!months.has(cursor.month)) {
			nextMonth(cursor);
		} else if (!matchesDay(cursor)) {
			nextDay(cursor);
		} else if (!hours.has(cursor.hour)) {
			nextHour(cursor);
		} else if (!minutes.has(cursor.minute)) {
			nextMinute(cursor);
		} else {
			const run = toDate(cursor, timezone);
			// Local times inside a DST gap resolve onto an existing time, so skip those repeats
			if (run > (runs[runs.length - 1] ?? from)) {
				runs.push(run);
			}
			nextMinute(cursor);
		}
	}

	return runs;
}
