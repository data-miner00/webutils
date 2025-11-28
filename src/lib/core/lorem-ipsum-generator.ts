import { LoremIpsum } from 'lorem-ipsum';

const lorem = new LoremIpsum({
	sentencesPerParagraph: {
		max: 8,
		min: 4
	},
	wordsPerSentence: {
		max: 16,
		min: 4
	}
});

export function generateWords(wordCount: number): string {
	return lorem.generateWords(wordCount);
}

export function generateSentences(sentenceCount: number): string {
	return lorem.generateSentences(sentenceCount);
}

export function generateParagraphs(paragraphCount: number): string {
	return lorem.generateParagraphs(paragraphCount);
}
