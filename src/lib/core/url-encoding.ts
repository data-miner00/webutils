export type UrlEncodingMode = 'encode' | 'decode';

export type Example = {
	input: string;
	mode: UrlEncodingMode;
};

export const exampleEncode: Example = {
	input: 'https://example.com/search?q=hello world&lang=pt-BR',
	mode: 'encode'
};

export const exampleDecode: Example = {
	input: 'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world%26lang%3Dpt-BR',
	mode: 'decode'
};

export function safeUrlEncode(input: string): string {
	try {
		return encodeURIComponent(input);
	} catch {
		return 'Input cannot be URL encoded';
	}
}

export function safeUrlDecode(input: string): string {
	try {
		return decodeURIComponent(input);
	} catch {
		return 'Invalid URL-encoded string';
	}
}
