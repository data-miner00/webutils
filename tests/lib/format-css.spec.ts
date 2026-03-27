import { formatCss } from '$lib/core/format-css';

describe('format CSS', () => {
	[
		{
			spacing: 4,
			expected: `body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
}`
		},
		{
			spacing: 2,
			expected: `body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}`
		}
	].forEach((scenario) => {
		it('should format CSS correctly', () => {
			const input = `body
 {
margin: 0;
  padding: 0; font-family: Arial, sans-serif;
}`;

			const actual = formatCss(input, { indentSize: scenario.spacing });
			expect(actual).toBe(scenario.expected);
		});
	});
});
