import { removeIndentation } from '$lib/core/remove-indentation';

describe('removeIndentation', () => {
	it('should remove common leading spaces', () => {
		const input = `    function test() {
        console.log("Hello, World!");
    }`;
		const expected = `function test() {
    console.log("Hello, World!");
}`;
		const result = removeIndentation(input);

		expect(result).toBe(expected);
	});

	it('should handle smart mode correctly', () => {
		const input = `function test() {
        console.log("Hello, World!");
    }`;
		const expected = `function test() {
    console.log("Hello, World!");
}`;
		const result = removeIndentation(input, true);

		expect(result).toBe(expected);
	});

	['', '    ', '\n\n'].forEach((input) => {
		it(`should handle input: "${input.replace(/\n/g, '\\n')}" correctly`, () => {
			const result = removeIndentation(input, true);
			expect(result).toBe('');
		});
	});

	[true, false].forEach((smartMode) => {
		it('should handle string without space correctly', () => {
			const result = removeIndentation('hello world', smartMode);
			expect(result).toBe('hello world');
		});
	});

	it('should remove common leading tabs', () => {
		const input = `		function test() {
			console.log("Hello, World!");
		}`;
		const expected = `function test() {
	console.log("Hello, World!");
}`;
		const result = removeIndentation(input);

		expect(result).toBe(expected);
	});

	it('should handle smart mode with tab indentation', () => {
		const input = `function test() {
			console.log("Hello, World!");
		}`;
		const expected = `function test() {
	console.log("Hello, World!");
}`;
		const result = removeIndentation(input, true);

		expect(result).toBe(expected);
	});
});
