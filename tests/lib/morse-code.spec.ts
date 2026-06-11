import { morseToText, textToMorse } from '$lib/core/morse-code';

describe('Morse Code Converter', () => {
	[
		{
			text: 'SOS',
			morse: '... --- ...'
		},
		{
			text: 'HELLO WORLD',
			morse: '.... . .-.. .-.. --- / .-- --- .-. .-.. -..'
		},
		{
			text: '123',
			morse: '.---- ..--- ...--'
		}
	].forEach(({ text, morse }) => {
		test(`converts "${text}" to "${morse}"`, () => {
			expect(textToMorse(text)).toBe(morse);
			expect(morseToText(morse)).toBe(text);
		});
	});
});
