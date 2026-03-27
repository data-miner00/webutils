import { hexToUnicode, unicodeToHex } from '$lib/core/hex';

describe('hex', () => {
	it('should convert unicode to hex', () => {
		const text = 'Hello';
		const expectedHex = '0x48 0x65 0x6c 0x6c 0x6f';
		expect(unicodeToHex(text)).toBe(expectedHex);
	});

	it('should handle empty string', () => {
		const text = '';
		const expectedHex = '';
		expect(unicodeToHex(text)).toBe(expectedHex);
	});

	it('should convert hex to unicode', () => {
		const text = '0x48 0x65 0x6c 0x6c 0x6f';
		const expectedUnicode = 'Hello';
		expect(hexToUnicode(text)).toBe(expectedUnicode);
	});

	it('should handle empty string for hex to unicode', () => {
		const text = '';
		const expectedUnicode = '';
		expect(hexToUnicode(text)).toBe(expectedUnicode);
	});

	it('should ignore invalid hex values', () => {
		const text = '0x48 0x65 0xZZ 0x6c 0x6f';
		const expectedUnicode = 'Helo';
		expect(hexToUnicode(text)).toBe(expectedUnicode);
	});
});
