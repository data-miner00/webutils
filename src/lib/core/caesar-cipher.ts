export function caesarCipher(plaintext: string, offset: number): string {
	let ciphertext = '';
	// Ensure the shift amount is within 0-25 and handles negative numbers correctly
	offset = ((offset % 26) + 26) % 26;

	for (let i = 0; i < plaintext.length; i++) {
		let plainCharacter = plaintext.charCodeAt(i);

		// Handle uppercase letters
		if (plainCharacter >= 65 && plainCharacter <= 90) {
			// 'A' to 'Z'
			ciphertext += String.fromCharCode(((plainCharacter - 65 + offset) % 26) + 65);
		}
		// Handle lowercase letters
		else if (plainCharacter >= 97 && plainCharacter <= 122) {
			// 'a' to 'z'
			ciphertext += String.fromCharCode(((plainCharacter - 97 + offset) % 26) + 97);
		}
		// Handle non-alphabet characters (like spaces, punctuation, numbers)
		else {
			ciphertext += String.fromCharCode(plainCharacter);
		}
	}
	return ciphertext;
}

export type Example = {
	input: string;
	offset: number;
};

export const example1: Example = {
	input: `This is a very long sentence, probably :)`,
	offset: 5
};

export const example2: Example = {
	input: `public static class Program
{
    public static void Main(string[] args)
    {
        Console.WriteLine("Hello World");
        return;
    }
}`,
	offset: 4
};
