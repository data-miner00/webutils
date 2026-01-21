import { exampleFormatJs, formatJs } from './format-js';

describe('format JS', () => {
	[
		{
			spacing: 4,
			expected: `function helloWorld(name, age) {
    return \`Hello \${name}, you are \${age} years old.\`;
}`
		},
		{
			spacing: 2,
			expected: `function helloWorld(name, age) {
  return \`Hello \${name}, you are \${age} years old.\`;
}`
		}
	].forEach((scenario) => {
		it('should format CSS correctly', () => {
			const input = exampleFormatJs;

			const actual = formatJs(input, { indentSize: scenario.spacing });
			expect(actual).toBe(scenario.expected);
		});
	});
});
