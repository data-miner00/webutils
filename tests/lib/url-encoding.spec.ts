import { describe, expect, it } from 'vitest';

import { exampleDecode, exampleEncode, safeUrlDecode, safeUrlEncode } from '$lib/core/url-encoding';

const pairs: [string, string][] = [
	['', ''],
	['hello', 'hello'],
	['hello world', 'hello%20world'],
	['a=1&b=2', 'a%3D1%26b%3D2'],
	['a+b', 'a%2Bb'],
	['https://example.com/?q=1', 'https%3A%2F%2Fexample.com%2F%3Fq%3D1'],
	['inglês', 'ingl%C3%AAs'],
	['😀', '%F0%9F%98%80']
];

describe('safeUrlEncode', () => {
	pairs.forEach(([decoded, encoded]) => {
		it(`should encode "${decoded}" to "${encoded}"`, () => {
			expect(safeUrlEncode(decoded)).toBe(encoded);
		});
	});

	it('should return an error message instead of throwing on a lone surrogate', () => {
		expect(safeUrlEncode('\uD800')).toBe('Input cannot be URL encoded');
	});
});

describe('safeUrlDecode', () => {
	pairs.forEach(([decoded, encoded]) => {
		it(`should decode "${encoded}" to "${decoded}"`, () => {
			expect(safeUrlDecode(encoded)).toBe(decoded);
		});
	});

	it('should leave a plus sign as a literal plus', () => {
		expect(safeUrlDecode('a+b')).toBe('a+b');
	});

	['100%', '%E0%A4%A', '%ZZ'].forEach((input) => {
		it(`should return an error message for malformed input "${input}"`, () => {
			expect(safeUrlDecode(input)).toBe('Invalid URL-encoded string');
		});
	});
});

describe('examples', () => {
	it('should decode the decode example back to the encode example', () => {
		expect(safeUrlDecode(exampleDecode.input)).toBe(exampleEncode.input);
	});

	it('should encode the encode example to the decode example', () => {
		expect(safeUrlEncode(exampleEncode.input)).toBe(exampleDecode.input);
	});
});
