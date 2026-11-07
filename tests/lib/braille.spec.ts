import {
	brailleToText,
	cellToDots,
	describeCell,
	dotsToCell,
	findUnsupportedCharacters,
	isBrailleCell,
	textToBraille
} from '$lib/core/braille';

describe('dotsToCell', () => {
	it('should map dots to Unicode braille patterns', () => {
		expect(dotsToCell([1, 2])).toBe('⠃');
		expect(dotsToCell([1, 4, 5, 6])).toBe('⠹');
		expect(dotsToCell([1, 2, 3, 4, 5, 6, 7, 8])).toBe('⣿');
	});

	it('should map no dots to the blank cell', () => {
		expect(dotsToCell([])).toBe('⠀');
	});
});

describe('cellToDots', () => {
	it('should return the raised dots in order', () => {
		expect(cellToDots('⠹')).toEqual([1, 4, 5, 6]);
		expect(cellToDots('⣀')).toEqual([7, 8]);
		expect(cellToDots('⠀')).toEqual([]);
	});

	it('should throw for characters that are not braille cells', () => {
		expect(() => cellToDots('a')).toThrow('"a" is not a braille cell');
	});
});

describe('isBrailleCell', () => {
	it('should only accept single braille pattern characters', () => {
		expect(isBrailleCell('⠁')).toBe(true);
		expect(isBrailleCell('a')).toBe(false);
		expect(isBrailleCell('⠁⠃')).toBe(false);
		expect(isBrailleCell('')).toBe(false);
	});
});

describe('textToBraille', () => {
	it.each([
		['abc', '⠁⠃⠉'],
		['Hello', '⠠⠓⠑⠇⠇⠕'],
		['NASA', '⠠⠠⠝⠁⠎⠁'],
		['CDs', '⠠⠠⠉⠙⠠⠄⠎'],
		["O'NEILL", '⠠⠕⠄⠠⠠⠝⠑⠊⠇⠇'],
		['THIS IS LOUD', '⠠⠠⠠⠞⠓⠊⠎ ⠊⠎ ⠇⠕⠥⠙⠠⠄'],
		['123', '⠼⠁⠃⠉'],
		['3.14', '⠼⠉⠲⠁⠙'],
		['1,000', '⠼⠁⠂⠚⠚⠚'],
		['3a', '⠼⠉⠰⠁'],
		['3rd', '⠼⠉⠗⠙'],
		['3D', '⠼⠉⠠⠙'],
		['555-0100', '⠼⠑⠑⠑⠤⠼⠚⠁⠚⠚'],
		['Hi, there!', '⠠⠓⠊⠂ ⠞⠓⠑⠗⠑⠖'],
		['"Hi?"', '⠦⠠⠓⠊⠦⠴'],
		['Why ?', '⠠⠺⠓⠽ ⠰⠦'],
		['(a+b)=c', '⠐⠣⠁⠐⠖⠃⠐⠜⠐⠶⠉'],
		['50% @ $3', '⠼⠑⠚⠨⠴ ⠈⠁ ⠈⠎⠼⠉']
	])('should translate %s', (text, braille) => {
		expect(textToBraille(text)).toBe(braille);
	});

	it('should use the dash for both en and em dashes', () => {
		expect(textToBraille('–')).toBe('⠠⠤');
		expect(textToBraille('—')).toBe('⠠⠤');
	});

	it('should keep whitespace and unsupported characters as they are', () => {
		expect(textToBraille('a\nb  c')).toBe('⠁\n⠃  ⠉');
		expect(textToBraille('café')).toBe('⠉⠁⠋é');
	});

	it('should return an empty string for empty input', () => {
		expect(textToBraille('')).toBe('');
	});
});

describe('brailleToText', () => {
	it.each([
		'Hello, World!',
		'NASA',
		'CDs',
		"O'NEILL",
		'THIS IS LOUD',
		'ROOM 3A IS OPEN',
		'McDonald',
		'3.14',
		'1,000',
		'3a',
		'3rd',
		'3D',
		'MP3',
		'555-0100',
		'"Hi?"',
		'Why ?',
		'(?)',
		'(a+b)=c',
		'50% @ $3',
		'I have 3 cats.',
		'Call 555-0100 before 9:30.',
		'"Is 2+2=4?" (Yes, 100%.)',
		'a\nb  c'
	])('should round-trip %s', (text) => {
		expect(brailleToText(textToBraille(text))).toBe(text);
	});

	it('should read the blank cell as a space', () => {
		expect(brailleToText('⠁⠀⠃')).toBe('a b');
	});

	it('should keep cells and characters it does not know', () => {
		expect(brailleToText('⣿x')).toBe('⣿x');
	});
});

describe('findUnsupportedCharacters', () => {
	it('should list each unsupported character once', () => {
		expect(findUnsupportedCharacters('Café, naïve café!')).toEqual(['é', 'ï']);
	});

	it('should return nothing for supported text', () => {
		expect(findUnsupportedCharacters('Hello, World! 1+1=2 "quoted" – done')).toEqual([]);
	});
});

describe('describeCell', () => {
	it('should describe letters that double as digits', () => {
		expect(describeCell('⠁')).toEqual(['Letter "a"', 'Digit "1" in numeric mode']);
	});

	it('should describe cells with more than one meaning', () => {
		expect(describeCell('⠦')).toEqual(['Opening double quote "', 'Question mark "?"']);
	});

	it('should describe prefixes of multi-cell symbols', () => {
		expect(describeCell('⠐')).toEqual(['First cell of ( ) * + =']);
	});

	it('should describe indicators', () => {
		expect(describeCell('⠼')).toEqual(['Numeric indicator: a–j that follow are digits']);
	});

	it('should describe the blank cell', () => {
		expect(describeCell('⠀')).toEqual(['Blank cell, read as a space']);
	});

	it('should return nothing for cells without a meaning', () => {
		expect(describeCell('⣿')).toEqual([]);
	});
});
