import { describeCron, getNextRuns, parseCron } from '$lib/core/cron';

function nextRunsUtc(expression: string, from: string, count: number): Date[] {
	return getNextRuns(parseCron(expression), new Date(from), count, 'utc');
}

describe('parseCron', () => {
	it('should expand wildcards with steps', () => {
		expect(parseCron('*/15 * * * *').minute.values).toEqual([0, 15, 30, 45]);
	});

	it('should expand lists and ranges', () => {
		expect(parseCron('1,5-7 * * * *').minute.values).toEqual([1, 5, 6, 7]);
	});

	it('should treat a single value with a step as running until the max', () => {
		expect(parseCron('5/15 * * * *').minute.values).toEqual([5, 20, 35, 50]);
	});

	it('should accept month and day names case-insensitively', () => {
		const schedule = parseCron('0 0 * JAN,mar MON-FRI');

		expect(schedule.month.values).toEqual([1, 3]);
		expect(schedule.dayOfWeek.values).toEqual([1, 2, 3, 4, 5]);
	});

	it('should treat 7 as Sunday', () => {
		expect(parseCron('0 0 * * 5-7').dayOfWeek.values).toEqual([0, 5, 6]);
	});

	it('should keep the raw text of each field', () => {
		expect(parseCron('  0   0 * * SUN ').dayOfWeek).toEqual({ raw: 'SUN', values: [0] });
	});

	it('should expand macros', () => {
		const schedule = parseCron('@DAILY');

		expect(schedule.minute.values).toEqual([0]);
		expect(schedule.hour.values).toEqual([0]);
		expect(schedule.dayOfMonth.raw).toBe('*');
	});

	it('should throw for an empty expression', () => {
		expect(() => parseCron('  ')).toThrow('Expression is empty');
	});

	it('should throw when the field count is wrong', () => {
		expect(() => parseCron('* * * *')).toThrow('Expected 5 fields but got 4');
		expect(() => parseCron('0 0 * * * *')).toThrow('Expected 5 fields but got 6');
	});

	it('should throw for out of range values', () => {
		expect(() => parseCron('60 * * * *')).toThrow(
			'Invalid minute value "60": must be between 0 and 59'
		);
		expect(() => parseCron('* * 0 * *')).toThrow(
			'Invalid day-of-month value "0": must be between 1 and 31'
		);
	});

	it('should throw for invalid steps, ranges and names', () => {
		expect(() => parseCron('*/0 * * * *')).toThrow(
			'Invalid minute step "0": must be a positive number'
		);
		expect(() => parseCron('* 10-5 * * *')).toThrow(
			'Invalid hour range "10-5": start is greater than end'
		);
		expect(() => parseCron('* * * FOO *')).toThrow('Invalid month value "FOO"');
	});

	it('should throw for unsupported macros', () => {
		expect(() => parseCron('@reboot')).toThrow('Unsupported macro "@reboot"');
	});
});

describe('describeCron', () => {
	it.each([
		['* * * * *', 'At every minute.'],
		['*/5 * * * *', 'At every 5th minute.'],
		['0 * * * *', 'At minute 0.'],
		['5,10-20 * * * *', 'At minute 5 and every minute from 10 through 20.'],
		['30 9 * * MON-FRI', 'At 09:30 on every day-of-week from Monday through Friday.'],
		['0 0 1,15 * *', 'At 00:00 on day-of-month 1 and 15.'],
		['23 0-20/2 * * *', 'At minute 23 past every 2nd hour from 0 through 20.'],
		['0 0,12 1 */2 *', 'At minute 0 past hour 0 and 12 on day-of-month 1 in every 2nd month.'],
		['0 0 1 JAN *', 'At 00:00 on day-of-month 1 in January.'],
		['0 0 13 * 5', 'At 00:00 on day-of-month 13 or on Friday.'],
		['0 0 */2 * 1', 'At 00:00 on every 2nd day-of-month and on Monday.'],
		['0 0 * * 7', 'At 00:00 on Sunday.'],
		['@weekly', 'At 00:00 on Sunday.']
	])('should describe "%s"', (expression, expected) => {
		expect(describeCron(parseCron(expression))).toBe(expected);
	});
});

describe('getNextRuns', () => {
	it('should return runs strictly after the given time', () => {
		expect(nextRunsUtc('*/15 * * * *', '2024-01-01T10:07:30Z', 3)).toEqual([
			new Date('2024-01-01T10:15:00Z'),
			new Date('2024-01-01T10:30:00Z'),
			new Date('2024-01-01T10:45:00Z')
		]);
		expect(nextRunsUtc('0 0 * * *', '2024-01-01T00:00:00Z', 1)).toEqual([
			new Date('2024-01-02T00:00:00Z')
		]);
	});

	it('should skip days that do not match the day-of-week', () => {
		// 2024-01-05 is a Friday
		expect(nextRunsUtc('30 9 * * 1-5', '2024-01-05T10:00:00Z', 2)).toEqual([
			new Date('2024-01-08T09:30:00Z'),
			new Date('2024-01-09T09:30:00Z')
		]);
	});

	it('should match either day field when both are restricted', () => {
		expect(nextRunsUtc('0 0 13 * 5', '2024-01-01T00:00:00Z', 4)).toEqual([
			new Date('2024-01-05T00:00:00Z'),
			new Date('2024-01-12T00:00:00Z'),
			new Date('2024-01-13T00:00:00Z'),
			new Date('2024-01-19T00:00:00Z')
		]);
	});

	it('should match both day fields when one starts with a wildcard', () => {
		expect(nextRunsUtc('0 0 */2 * 1', '2024-01-01T00:00:00Z', 3)).toEqual([
			new Date('2024-01-15T00:00:00Z'),
			new Date('2024-01-29T00:00:00Z'),
			new Date('2024-02-05T00:00:00Z')
		]);
	});

	it('should skip months without the given day', () => {
		expect(nextRunsUtc('0 0 31 * *', '2024-01-31T12:00:00Z', 2)).toEqual([
			new Date('2024-03-31T00:00:00Z'),
			new Date('2024-05-31T00:00:00Z')
		]);
	});

	it('should roll over into the next year', () => {
		expect(nextRunsUtc('0 0 1 1 *', '2024-06-01T00:00:00Z', 1)).toEqual([
			new Date('2025-01-01T00:00:00Z')
		]);
	});

	it('should find the next leap day', () => {
		expect(nextRunsUtc('0 0 29 2 *', '2024-03-01T00:00:00Z', 1)).toEqual([
			new Date('2028-02-29T00:00:00Z')
		]);
	});

	it('should return no runs for a schedule that never matches', () => {
		expect(nextRunsUtc('0 0 30 2 *', '2024-01-01T00:00:00Z', 5)).toEqual([]);
	});

	it('should use local time by default', () => {
		const schedule = parseCron('0 0 * * *');

		expect(getNextRuns(schedule, new Date(2024, 0, 1, 12, 0), 1)).toEqual([new Date(2024, 0, 2)]);
	});
});
