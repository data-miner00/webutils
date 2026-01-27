/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { imageToBase64 } from './base64';

describe('imageToBase64', () => {
	let mockFile: File;

	beforeEach(() => {
		mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
	});

	it('should convert an image file to base64 string', async () => {
		const expectedBase64 = 'data:text/plain;base64,dGVzdCBjb250ZW50';

		const result = await imageToBase64(mockFile);

		expect(result).toBe(expectedBase64);
	});

	it('should handle file with different mime types', async () => {
		const imageFile = new File(['image data'], 'test.png', { type: 'image/png' });

		const result = await imageToBase64(imageFile);

		expect(result).toMatch(/^data:image\/png;base64,/);
	});

	it('should resolve with a data URL string', async () => {
		const result = await imageToBase64(mockFile);

		expect(typeof result).toBe('string');
		expect(result).toMatch(/^data:/);
	});
});
