export type Example = {
	input: string;
	mode: 'encode' | 'decode';
};

export const exampleEncode = {
	input: 'Lorem ipsum dolor sit amet.',
	mode: 'encode'
} as Example;

export function base64Encode(input: string): string {
	return btoa(input);
}

export const exampleDecode = {
	input: 'TG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQu',
	mode: 'decode'
} as Example;

export function base64Decode(input: string): string {
	return atob(input);
}

export function safeToBase64Encode(str: string): string {
	try {
		return btoa(str);
	} catch {
		return 'Error encoding to Base64';
	}
}
