import { caesarCipher } from '$lib/core/caesar-cipher';

// abcdefghijklmnopqrstuvwxyz

describe('caesar cipher', () => {
	[
		{ original: 'hello', offset: 0, expected: 'hello' },
		{ original: 'what is this', offset: 0, expected: 'what is this' },
		{ original: 'abcde123', offset: 0, expected: 'abcde123' },

		{ original: 'hello', offset: 3, expected: 'khoor' },
		{ original: 'what is this', offset: 3, expected: 'zkdw lv wklv' },
		{ original: 'abcde123', offset: 3, expected: 'defgh123' },

		{ original: 'hello', offset: 6, expected: 'nkrru' },
		{ original: 'what is this', offset: 6, expected: 'cngz oy znoy' },
		{ original: 'abcde123', offset: 6, expected: 'ghijk123' }
	].forEach((scenario) => {
		it(`should encrypt ${scenario.original} offset ${scenario.offset} correctly.`, () => {
			const actual = caesarCipher(scenario.original, scenario.offset);
			expect(actual).toBe(scenario.expected);
		});
	});
});
