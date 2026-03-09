import { removeTrailingSpace } from './remove-trailing-space';

describe('remove trailing space', () => {
	[
		{
			input: 'hello    \nworld    \n',
			expected: 'hello\nworld\n'
		},
		{
			input: '    hello  \nworld\n bye   \nhaha',
			expected: '    hello\nworld\n bye\nhaha'
		}
	].forEach((scenario) => {
		it('normal mode', () => {
			expect(removeTrailingSpace(scenario.input)).toBe(scenario.expected);
		});
	});

	[
		{
			input: 'hello    \n\n\nworld    \n',
			expected: 'hello\nworld'
		},
		{
			input: '    hello  \nworld\n bye   \n\nhaha',
			expected: '    hello\nworld\n bye\nhaha'
		}
	].forEach((scenario) => {
		it('remove empty line mode', () => {
			expect(removeTrailingSpace(scenario.input, true)).toBe(scenario.expected);
		});
	});
});
