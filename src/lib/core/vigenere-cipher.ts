export function vigenereCipher(plainText: string, key: string): string {
	let cipherText = '';
	const keyLength = key.length;
	for (let i = 0; i < plainText.length; i++) {
		const plainChar = plainText[i];
		const keyChar = key[i % keyLength];
		if (plainChar.match(/[a-z]/i)) {
			const base = plainChar.toUpperCase() === plainChar ? 65 : 97;
			const cipherChar = String.fromCharCode(
				((plainChar.charCodeAt(0) - base + (keyChar.toUpperCase().charCodeAt(0) - 65)) % 26) + base
			);
			cipherText += cipherChar;
		} else {
			cipherText += plainChar;
		}
	}
	return cipherText;
}

export function vigenereDecipher(cipherText: string, key: string): string {
	let plainText = '';
	const keyLength = key.length;
	for (let i = 0; i < cipherText.length; i++) {
		const cipherChar = cipherText[i];
		const keyChar = key[i % keyLength];
		if (cipherChar.match(/[a-z]/i)) {
			const base = cipherChar.toUpperCase() === cipherChar ? 65 : 97;
			const plainChar = String.fromCharCode(
				((cipherChar.charCodeAt(0) - base - (keyChar.toUpperCase().charCodeAt(0) - 65) + 26) % 26) +
					base
			);
			plainText += plainChar;
		} else {
			plainText += cipherChar;
		}
	}
	return plainText;
}
