import { removeEmptyLine } from '$lib/core/remove-empty-line';

describe('removeEmptyLine', () => {
	it('should remove empty lines from a string', () => {
		const input = `Line 1

Line 2
`;
		const expected = `Line 1
Line 2
`;
		expect(removeEmptyLine(input)).toBe(expected);
	});
});
