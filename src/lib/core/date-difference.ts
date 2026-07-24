export type DateDifference = {
	totalSeconds: number;
	totalMinutes: number;
	totalHours: number;
	totalDays: number;
	isNegative: boolean;
};

export function calculateDateDifference(start: string, end: string): DateDifference {
	const startDate = new Date(start);
	const endDate = new Date(end);

	if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
		throw new Error('Invalid date');
	}

	const diffMs = endDate.getTime() - startDate.getTime();
	const absMs = Math.abs(diffMs);

	return {
		totalSeconds: Math.floor(absMs / 1000),
		totalMinutes: Math.floor(absMs / (1000 * 60)),
		totalHours: Math.floor(absMs / (1000 * 60 * 60)),
		totalDays: Math.floor(absMs / (1000 * 60 * 60 * 24)),
		isNegative: diffMs < 0
	};
}
