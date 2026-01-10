import { readingTime } from 'reading-time-estimator';

export function countCharacters(text: string): number {
	return text.length;
}

export function countWords(text: string): number {
	return text.split(/\s+/).length;
}

export function countLines(text: string): number {
	return text.split('\n').length;
}

export function countParagraphs(text: string): number {
	return text.split('\n').filter((line) => line).length;
}

export function calculateReadingTimeInMins(text: string): number {
	const result = readingTime(text);
	return result.minutes;
}

// Todo: Support case insensitivity and punctuation removal
export function calculateWordDistribution(text: string): Map<string, number> {
	const map = new Map<string, number>();
	const words = text
		.split(/\s+/)
		.map((text) => text.trim())
		.filter((text) => text);

	for (var word of words) {
		map.set(word, (map.get(word) || 0) + 1);
	}

	return map;
}

export function calculateSizeInKB(text: string): number {
	const bytes = new TextEncoder().encode(text).length;
	return bytes / 1024;
}

export const sampleText = `Hello world!
This is a sample lines text.
It has multiple and multiple lines,
and multiple words.`;
