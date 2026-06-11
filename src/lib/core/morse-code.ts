// prettier-ignore
const MORSE_CODE_MAP = {
  'A': '.-',    'B': '-...',  'C': '-.-.',  'D': '-..',   'E': '.',
  'F': '..-.',  'G': '--.',   'H': '....',  'I': '..',    'J': '.---',
  'K': '-.-',   'L': '.-..',  'M': '--',    'N': '-.',    'O': '---',
  'P': '.--.',  'Q': '--.-',  'R': '.-.',   'S': '...',   'T': '-',
  'U': '..-',   'V': '...-',  'W': '.--',   'X': '-..-',  'Y': '-.--',
  'Z': '--..',  '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '0': '-----'
};

// Create a reverse map dynamically for decoding
const REVERSE_MORSE_MAP = Object.fromEntries(
	Object.entries(MORSE_CODE_MAP).map(([letter, morse]) => [morse, letter])
);

export function textToMorse(text: string) {
	return text
		.toUpperCase()
		.trim()
		.split(' ') // Split into words
		.map(
			(word) =>
				word
					.split('') // Split into characters
					.map((char) => MORSE_CODE_MAP[char as keyof typeof MORSE_CODE_MAP] || '') // Convert to Morse
					.filter((morseChar) => morseChar !== '') // Remove unsupported characters
					.join(' ') // Separate characters with a single space
		)
		.join(' / '); // Separate words with a slash
}

export function morseToText(morseText: string) {
	return morseText
		.trim()
		.split('/') // Split into words
		.map(
			(word) =>
				word
					.trim()
					.split(' ') // Split into Morse characters
					.map((morseChar) => REVERSE_MORSE_MAP[morseChar] || '') // Convert to text
					.join('') // Combine characters into a word
		)
		.join(' '); // Combine words into a sentence
}
