/**
 * @vitest-environment jsdom
 */
import { vi } from 'vitest';

import { clickToCopy } from '$lib/core/copy-to-clipboard';

// This test suite is very slow
describe.skip('clickToCopy', () => {
	let node: HTMLElement;
	let target: HTMLElement;
	let removeListener: () => void;

	beforeEach(() => {
		node = document.createElement('button');
		target = document.createElement('div');
		target.id = 'target';
		target.innerText = 'Text to copy';
		document.body.appendChild(node);
		document.body.appendChild(target);
		removeListener = clickToCopy(node, '#target');
	});

	afterEach(() => {
		removeListener();
		document.body.removeChild(node);
		document.body.removeChild(target);
	});

	it('should copy text to clipboard on click', async () => {
		const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
		const copySuccessListener = vi.fn();
		node.addEventListener('copysuccess', copySuccessListener);
		node.click();

		// Wait for async clipboard operation
		await new Promise(process.nextTick);
		expect(writeTextSpy).toHaveBeenCalledWith('Text to copy');
		expect(copySuccessListener).toHaveBeenCalled();
		writeTextSpy.mockRestore();
	});

	it('should dispatch copyerror event on failure', async () => {
		const writeTextSpy = vi
			.spyOn(navigator.clipboard, 'writeText')
			.mockRejectedValue(new Error('Copy failed'));
		const copyErrorListener = vi.fn();
		node.addEventListener('copyerror', copyErrorListener);
		node.click();
		// Wait for async clipboard operation
		await new Promise(process.nextTick);
		expect(writeTextSpy).toHaveBeenCalledWith('Text to copy');
		expect(copyErrorListener).toHaveBeenCalled();
		writeTextSpy.mockRestore();
	});
});
