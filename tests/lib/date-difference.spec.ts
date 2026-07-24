import { calculateDateDifference } from '$lib/core/date-difference';

describe('calculateDateDifference', () => {
	it('should calculate the difference between two dates', () => {
		const result = calculateDateDifference('2024-01-01T00:00:00Z', '2024-01-02T01:01:01Z');

		expect(result.totalSeconds).toBe(90061);
		expect(result.totalMinutes).toBe(1501);
		expect(result.totalHours).toBe(25);
		expect(result.totalDays).toBe(1);
		expect(result.isNegative).toBe(false);
	});

	it('should mark the difference as negative when end is before start', () => {
		const result = calculateDateDifference('2024-01-02T00:00:00Z', '2024-01-01T00:00:00Z');

		expect(result.totalDays).toBe(1);
		expect(result.isNegative).toBe(true);
	});

	it('should return zeros when the dates are identical', () => {
		const result = calculateDateDifference('2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z');

		expect(result.totalSeconds).toBe(0);
		expect(result.totalMinutes).toBe(0);
		expect(result.totalHours).toBe(0);
		expect(result.totalDays).toBe(0);
		expect(result.isNegative).toBe(false);
	});

	it('should throw for invalid dates', () => {
		expect(() => calculateDateDifference('not-a-date', '2024-01-01T00:00:00Z')).toThrow(
			'Invalid date'
		);
	});
});
