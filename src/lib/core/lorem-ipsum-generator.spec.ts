import * as lorem from './lorem-ipsum-generator';

describe('lorem-ipsum-generator', () => {
	it('should generate the correct number of words', () => {
		const wordCount = 10;
		const words = lorem.generateWords(wordCount);
		const generatedWordCount = words.split(' ').length;
		expect(generatedWordCount).toBe(wordCount);
	});

	it('should generate the correct number of sentences', () => {
		const sentenceCount = 5;
		const sentences = lorem.generateSentences(sentenceCount);
		const generatedSentenceCount = sentences.split('. ').length;
		expect(generatedSentenceCount).toBe(sentenceCount);
	});

	it('should generate the correct number of paragraphs', () => {
		const paragraphCount = 3;
		const paragraphs = lorem.generateParagraphs(paragraphCount);
		const generatedParagraphCount = paragraphs.split('\n').length;
		expect(generatedParagraphCount).toBe(paragraphCount);
	});
});
