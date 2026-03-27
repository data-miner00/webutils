import * as lorem from '$lib/core/lorem-ipsum-generator';

describe('lorem-ipsum-generator', () => {
	it('should generate the correct number of words', () => {
		const wordCount = 10;
		const words = lorem.generateWords(wordCount);
		const generatedWordCount = words.split(' ').length;
		expect(generatedWordCount).toBe(wordCount);
	});

	it('should generate words starting with Lorem Ipsum', () => {
		const wordCount = 15;
		const words = lorem.generateWords(wordCount, true);
		expect(words.startsWith('Lorem ipsum dolor sit amet')).toBe(true);
		const generatedWordCount = words.split(' ').length;
		expect(generatedWordCount).toBe(wordCount);
	});

	it('should generate the correct number of sentences', () => {
		const sentenceCount = 5;
		const sentences = lorem.generateSentences(sentenceCount);
		const generatedSentenceCount = sentences.split('. ').length;
		expect(generatedSentenceCount).toBe(sentenceCount);
	});

	it('should generate sentences starting with Lorem Ipsum', () => {
		const sentenceCount = 4;
		const sentences = lorem.generateSentences(sentenceCount, true);
		expect(sentences.startsWith('Lorem ipsum dolor sit amet')).toBe(true);
		const generatedSentenceCount = sentences.split('. ').length;
		expect(generatedSentenceCount).toBe(sentenceCount);
	});

	it('should generate the correct number of paragraphs', () => {
		const paragraphCount = 3;
		const paragraphs = lorem.generateParagraphs(paragraphCount);
		const generatedParagraphCount = paragraphs.split('\n').length;
		expect(generatedParagraphCount).toBe(paragraphCount);
	});

	it('should generate paragraphs starting with Lorem Ipsum', () => {
		const paragraphCount = 2;
		const paragraphs = lorem.generateParagraphs(paragraphCount, true);
		expect(paragraphs.startsWith('Lorem ipsum dolor sit amet')).toBe(true);
		const generatedParagraphCount = paragraphs.split('\n').length;
		expect(generatedParagraphCount).toBe(paragraphCount);
	});
});
