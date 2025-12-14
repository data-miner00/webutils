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

const starting = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
const starting2 = 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
const startingWordCount = starting.split(' ').length;

export function generateWords(wordCount: number, startWithLorem: boolean = false): string {
	if (startWithLorem) {
		if (wordCount <= startingWordCount) {
			return starting.split(' ').slice(0, wordCount).join(' ');
		}

		const remainingWordCount = wordCount - startingWordCount;
		const generatedWords = lorem.generateWords(remainingWordCount);
		return `${starting} ${generatedWords}`;
	}

	return lorem.generateWords(wordCount);
}

export function generateSentences(sentenceCount: number, startWithLorem: boolean = false): string {
	if (startWithLorem) {
		const generatedSentences = lorem.generateSentences(sentenceCount - 1);
		return `${starting} ${generatedSentences}`;
	}

	return lorem.generateSentences(sentenceCount);
}

export function generateParagraphs(
	paragraphCount: number,
	startWithLorem: boolean = false
): string {
	if (startWithLorem) {
		if (paragraphCount === 1) {
			return starting + ' ' + starting2;
		}
		const generatedParagraphs = lorem.generateParagraphs(paragraphCount - 1);
		return `${starting} ${starting2}\n${generatedParagraphs}`;
	}

	return lorem.generateParagraphs(paragraphCount);
}
