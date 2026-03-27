import {
	calculateReadingTimeInMins,
	calculateSizeInKB,
	calculateWordDistribution,
	countCharacters,
	countLines,
	countParagraphs,
	countWords
} from '$lib/core/word-counter';

describe('Word Counter', () => {
	const sampleText = `Hello world!
This is a sample text.
It has multiple lines,
and multiple words.`;
	it('countCharacters should return correct character count', () => {
		expect(countCharacters(sampleText)).toBe(78);
	});

	it('countWords should return correct word count', () => {
		expect(countWords(sampleText)).toBe(14);
	});

	it('countLines should return correct line count', () => {
		expect(countLines(sampleText)).toBe(4);
	});

	it('countParagraphs should return correct paragraph count', () => {
		expect(countParagraphs(sampleText)).toBe(4);
	});

	it('calculateReadingTimeInMins should return correct reading time', () => {
		const readingTime = calculateReadingTimeInMins(sampleText);
		expect(readingTime).toBe(0);
	});

	it('calculateWordDistribution should return correct word distribution', () => {
		const distribution = calculateWordDistribution(sampleText);
		expect(distribution.get('multiple')).toBe(2);
		expect(distribution.get('Hello')).toBe(1);
		expect(distribution.get('text.')).toBe(1);
	});

	it('calculateSizeInKB should return correct size in KB', () => {
		const sizeInKB = calculateSizeInKB(sampleText);
		expect(sizeInKB).toBeCloseTo(0.076, 3); // Approximately 78 bytes
	});
});
