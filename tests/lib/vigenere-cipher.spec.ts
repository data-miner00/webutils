import { vigenereCipher, vigenereDecipher } from '$lib/core/vigenere-cipher';

describe('Vigenère Cipher', () => {
	it('should encrypt and decrypt correctly', () => {
		const plainText = 'HELLO WORLD';
		const key = 'KEY';
		const cipherText = vigenereCipher(plainText, key);
		const decryptedText = vigenereDecipher(cipherText, key);
		expect(decryptedText).toBe(plainText);
	});

	it('should handle non-alphabetic characters', () => {
		const plainText = 'HELLO, WORLD!';
		const key = 'KEY';
		const cipherText = vigenereCipher(plainText, key);
		const decryptedText = vigenereDecipher(cipherText, key);
		expect(decryptedText).toBe(plainText);
	});
});
