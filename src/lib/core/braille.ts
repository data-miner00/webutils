// Uncontracted (Grade 1) Unified English Braille, written as Unicode braille patterns

export type BrailleSymbol = {
	print: string;
	braille: string;
	name: string;
};

const BRAILLE_START = 0x2800;
const BRAILLE_END = 0x28ff;
const DOT_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8];
const CAPITALS_PASSAGE_LENGTH = 3;
const OPENING_BRACKETS = '([{<';

export function dotsToCell(dots: number[]): string {
	const mask = dots.reduce((bits, dot) => bits | (1 << (dot - 1)), 0);
	return String.fromCharCode(BRAILLE_START + mask);
}

export function isBrailleCell(char: string): boolean {
	const code = char.charCodeAt(0);
	return char.length === 1 && code >= BRAILLE_START && code <= BRAILLE_END;
}

export function cellToDots(cell: string): number[] {
	if (!isBrailleCell(cell)) {
		throw new Error(`"${cell}" is not a braille cell`);
	}

	const mask = cell.charCodeAt(0) - BRAILLE_START;
	return DOT_NUMBERS.filter((dot) => mask & (1 << (dot - 1)));
}

// Builds cells from dot groups, e.g. cells('5', '126') is '⠐⠣'
function cells(...groups: string[]): string {
	return groups.map((group) => dotsToCell([...group].map(Number))).join('');
}

const BLANK_CELL = cells('');
const NUMERIC_INDICATOR = cells('3456');
const GRADE_1_INDICATOR = cells('56');
const CAPITAL_LETTER = cells('6');
const CAPITALS_WORD = cells('6', '6');
const CAPITALS_PASSAGE = cells('6', '6', '6');
const CAPITALS_TERMINATOR = cells('6', '3');
const OPENING_QUOTE = cells('236');
const CLOSING_QUOTE = cells('356');
const QUESTION_MARK = cells('236');

// prettier-ignore
const LETTER_DOTS: Record<string, string> = {
	a: '1',   b: '12',   c: '14',   d: '145',   e: '15',    f: '124',  g: '1245', h: '125',  i: '24',  j: '245',
	k: '13',  l: '123',  m: '134',  n: '1345',  o: '135',   p: '1234', q: '12345', r: '1235', s: '234', t: '2345',
	u: '136', v: '1236', w: '2456', x: '1346',  y: '13456', z: '1356'
};

const SYMBOLS: BrailleSymbol[] = [
	{ print: ',', braille: cells('2'), name: 'Comma' },
	{ print: ';', braille: cells('23'), name: 'Semicolon' },
	{ print: ':', braille: cells('25'), name: 'Colon' },
	{ print: '.', braille: cells('256'), name: 'Full stop' },
	{ print: '!', braille: cells('235'), name: 'Exclamation mark' },
	{ print: '?', braille: QUESTION_MARK, name: 'Question mark' },
	{ print: "'", braille: cells('3'), name: 'Apostrophe' },
	{ print: '-', braille: cells('36'), name: 'Hyphen' },
	{ print: '—', braille: cells('6', '36'), name: 'Dash' },
	{ print: '(', braille: cells('5', '126'), name: 'Opening parenthesis' },
	{ print: ')', braille: cells('5', '345'), name: 'Closing parenthesis' },
	{ print: '[', braille: cells('46', '126'), name: 'Opening square bracket' },
	{ print: ']', braille: cells('46', '345'), name: 'Closing square bracket' },
	{ print: '{', braille: cells('456', '126'), name: 'Opening curly bracket' },
	{ print: '}', braille: cells('456', '345'), name: 'Closing curly bracket' },
	{ print: '<', braille: cells('4', '126'), name: 'Less-than sign' },
	{ print: '>', braille: cells('4', '345'), name: 'Greater-than sign' },
	{ print: '/', braille: cells('456', '34'), name: 'Slash' },
	{ print: '\\', braille: cells('456', '16'), name: 'Backslash' },
	{ print: '|', braille: cells('456', '1256'), name: 'Vertical bar' },
	{ print: '@', braille: cells('4', '1'), name: 'At sign' },
	{ print: '&', braille: cells('4', '12346'), name: 'Ampersand' },
	{ print: '#', braille: cells('456', '1456'), name: 'Number sign' },
	{ print: '$', braille: cells('4', '234'), name: 'Dollar sign' },
	{ print: '%', braille: cells('46', '356'), name: 'Percent sign' },
	{ print: '*', braille: cells('5', '35'), name: 'Asterisk' },
	{ print: '+', braille: cells('5', '235'), name: 'Plus sign' },
	{ print: '=', braille: cells('5', '2356'), name: 'Equals sign' },
	{ print: '_', braille: cells('46', '36'), name: 'Underscore' },
	{ print: '~', braille: cells('4', '35'), name: 'Tilde' },
	{ print: '^', braille: cells('4', '26'), name: 'Caret' }
];

const LETTER_CELLS = new Map(
	Object.entries(LETTER_DOTS).map(([letter, dots]) => [letter, cells(dots)])
);
const LETTER_BY_CELL = new Map([...LETTER_CELLS].map(([letter, cell]) => [cell, letter]));

// Digits reuse the letters a–j after the numeric indicator
const DIGIT_CELLS = new Map(
	[...'1234567890'].map((digit, index) => [digit, LETTER_CELLS.get('abcdefghij'[index])!])
);
const DIGIT_BY_CELL = new Map([...DIGIT_CELLS].map(([digit, cell]) => [cell, digit]));

const SYMBOL_BY_PRINT = new Map(SYMBOLS.map((symbol) => [symbol.print, symbol.braille]));
const SYMBOL_BY_BRAILLE = new Map(SYMBOLS.map((symbol) => [symbol.braille, symbol.print]));

export const brailleExamples = [
	{ title: 'Greeting', text: 'Hello, World!' },
	{ title: 'Numbers', text: 'Call 555-0100 before 9:30.' },
	{ title: 'Capitals', text: 'NASA launched 3 rockets' },
	{ title: 'Capitals passage', text: 'READ THIS FIRST' },
	{ title: 'Quotes and symbols', text: '"Is 2+2=4?" (Yes, 100%.)' }
];

function isLetter(char: string): boolean {
	return /^[A-Za-z]$/.test(char);
}

function isUppercase(char: string): boolean {
	return char >= 'A' && char <= 'Z';
}

function isCapitalsWord(word: string): boolean {
	return /[A-Z]/.test(word) && !/[a-z]/.test(word);
}

// Quotes and question marks share a cell, so whether one opens a word decides how it's read
function isWordStart(previous: string | undefined): boolean {
	return previous === undefined || /\s/.test(previous) || OPENING_BRACKETS.includes(previous);
}

function toLetterCells(letters: string): string {
	return [...letters.toLowerCase()].map((letter) => LETTER_CELLS.get(letter)).join('');
}

function translateLetters(letters: string, isCapitalsPassage: boolean): string {
	if (isCapitalsPassage) return toLetterCells(letters);

	let result = '';
	let index = 0;

	while (index < letters.length) {
		let end = index;
		while (end < letters.length && isUppercase(letters[end])) end++;

		if (end - index >= 2) {
			result += CAPITALS_WORD + toLetterCells(letters.slice(index, end));
			// Lowercase letters later in the same word need capitals mode ended, e.g. "CDs"
			if (end < letters.length) result += CAPITALS_TERMINATOR;
			index = end;
		} else {
			const letter = letters[index];
			result += (isUppercase(letter) ? CAPITAL_LETTER : '') + toLetterCells(letter);
			index++;
		}
	}

	return result;
}

function translateWord(word: string, isCapitalsPassage: boolean): string {
	let result = '';
	let isNumeric = false;
	let index = 0;

	while (index < word.length) {
		const char = word[index];
		const previous = word[index - 1];

		if (isLetter(char)) {
			let end = index;
			while (end < word.length && isLetter(word[end])) end++;

			const letters = translateLetters(word.slice(index, end), isCapitalsPassage);
			// A letter a–j straight after a number would be read as a digit
			result += (isNumeric && DIGIT_BY_CELL.has(letters[0]) ? GRADE_1_INDICATOR : '') + letters;
			isNumeric = false;
			index = end;
			continue;
		}

		const digit = DIGIT_CELLS.get(char);
		if (digit) {
			result += (isNumeric ? '' : NUMERIC_INDICATOR) + digit;
			isNumeric = true;
		} else if (char === '"') {
			result += isWordStart(previous) ? OPENING_QUOTE : CLOSING_QUOTE;
			isNumeric = false;
		} else if (char === '?') {
			// A question mark opening a word would be read as an opening quote
			result += (isWordStart(previous) ? GRADE_1_INDICATOR : '') + QUESTION_MARK;
			isNumeric = false;
		} else {
			// UEB uses the same dash for en and em dashes
			result += SYMBOL_BY_PRINT.get(char === '–' ? '—' : char) ?? char;
			// Full stops and commas continue a number, e.g. 3.14 and 1,000
			isNumeric = isNumeric && (char === '.' || char === ',');
		}
		index++;
	}

	return result;
}

export function textToBraille(text: string): string {
	// Odd indexes hold the whitespace between words
	const parts = text.split(/(\s+)/);
	let result = '';
	let passageEnd = -1;

	parts.forEach((part, index) => {
		if (index % 2 === 1) {
			result += part;
			return;
		}

		if (index > passageEnd && isCapitalsWord(part)) {
			let end = index;
			while (end + 2 < parts.length && isCapitalsWord(parts[end + 2])) end += 2;

			if ((end - index) / 2 + 1 >= CAPITALS_PASSAGE_LENGTH) {
				result += CAPITALS_PASSAGE;
				passageEnd = end;
			}
		}

		result += translateWord(part, index <= passageEnd);
		if (index === passageEnd) result += CAPITALS_TERMINATOR;
	});

	return result;
}

export function brailleToText(braille: string): string {
	let result = '';
	let isNumeric = false;
	let isCapitalLetter = false;
	let isCapitalsWord = false;
	let isCapitalsPassage = false;
	let index = 0;

	while (index < braille.length) {
		const char = braille[index];
		const twoCells = braille.slice(index, index + 2);

		if (braille.startsWith(CAPITALS_PASSAGE, index)) {
			isCapitalsPassage = true;
			isNumeric = false;
			index += CAPITALS_PASSAGE.length;
			continue;
		}

		if (twoCells === CAPITALS_TERMINATOR) {
			isCapitalsWord = false;
			isCapitalsPassage = false;
			index += 2;
			continue;
		}

		if (twoCells === CAPITALS_WORD) {
			isCapitalsWord = true;
			isNumeric = false;
			index += 2;
			continue;
		}

		const twoCellSymbol =
			twoCells === GRADE_1_INDICATOR + QUESTION_MARK ? '?' : SYMBOL_BY_BRAILLE.get(twoCells);
		if (twoCells.length === 2 && twoCellSymbol) {
			result += twoCellSymbol;
			isCapitalsWord = false;
			isNumeric = false;
			index += 2;
			continue;
		}

		index++;

		if (isNumeric && DIGIT_BY_CELL.has(char)) {
			result += DIGIT_BY_CELL.get(char);
			continue;
		}

		const letter = LETTER_BY_CELL.get(char);
		if (letter) {
			const isUppercaseLetter = isCapitalLetter || isCapitalsWord || isCapitalsPassage;
			result += isUppercaseLetter ? letter.toUpperCase() : letter;
			isCapitalLetter = false;
			isNumeric = false;
			continue;
		}

		// Anything other than a letter ends a capitals word, e.g. the apostrophe in O'NEILL
		const wasNumeric: boolean = isNumeric;
		isCapitalsWord = false;
		isNumeric = false;

		if (char === NUMERIC_INDICATOR) {
			isNumeric = true;
		} else if (char === CAPITAL_LETTER) {
			isCapitalLetter = true;
		} else if (char === GRADE_1_INDICATOR) {
			// Only ends numeric mode
		} else if (char === BLANK_CELL) {
			result += ' ';
		} else if (char === OPENING_QUOTE) {
			result += isWordStart(result[result.length - 1]) ? '"' : '?';
		} else if (char === CLOSING_QUOTE) {
			result += '"';
		} else {
			const print = SYMBOL_BY_BRAILLE.get(char);
			result += print ?? char;
			isNumeric = wasNumeric && (print === '.' || print === ',');
		}
	}

	return result;
}

export function findUnsupportedCharacters(text: string): string[] {
	const unsupported = [...text].filter(
		(char) =>
			!/\s/.test(char) &&
			!isLetter(char) &&
			!DIGIT_CELLS.has(char) &&
			!SYMBOL_BY_PRINT.has(char) &&
			char !== '"' &&
			char !== '–'
	);

	return [...new Set(unsupported)];
}

export function describeCell(cell: string): string[] {
	const meanings: string[] = [];
	const letter = LETTER_BY_CELL.get(cell);
	const digit = DIGIT_BY_CELL.get(cell);

	if (cell === BLANK_CELL) meanings.push('Blank cell, read as a space');
	if (letter) meanings.push(`Letter "${letter}"`);
	if (digit) meanings.push(`Digit "${digit}" in numeric mode`);
	if (cell === NUMERIC_INDICATOR) meanings.push('Numeric indicator: a–j that follow are digits');
	if (cell === GRADE_1_INDICATOR) meanings.push('Grade 1 indicator: ends numeric mode');
	if (cell === CAPITAL_LETTER) {
		meanings.push('Capital indicator: ⠠ letter, ⠠⠠ word, ⠠⠠⠠ passage, ⠠⠄ ends capitals');
	}
	if (cell === OPENING_QUOTE) meanings.push('Opening double quote "');
	if (cell === CLOSING_QUOTE) meanings.push('Closing double quote "');

	const prefixOf: string[] = [];
	for (const symbol of SYMBOLS) {
		if (symbol.braille === cell) {
			meanings.push(`${symbol.name} "${symbol.print}"`);
		} else if (symbol.braille.startsWith(cell)) {
			prefixOf.push(symbol.print);
		}
	}
	if (prefixOf.length) meanings.push(`First cell of ${prefixOf.join(' ')}`);

	return meanings;
}
