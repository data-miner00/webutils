import { exampleFormatJs, formatJs, minifyJs } from '$lib/core/format-js';

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
		it('should format JavaScript correctly', () => {
			const input = exampleFormatJs.input;

			const actual = formatJs(input, { indentSize: scenario.spacing });
			expect(actual).toBe(scenario.expected);
		});
	});
});

describe('minifyJs', () => {
	it('should minify JavaScript code', async () => {
		const js = `
            function add(a, b) {
                return a + b;
            }
            console.log(add(2, 3));
        `;
		const minified = await minifyJs(js);
		expect(minified).toBe('function add(d,n){return d+n}console.log(add(2,3));');
	});

	it('should return original code if minification fails', async () => {
		const js = `
            function add(a, b) {
                return a + b
        `; // Missing closing brace to induce error
		const minified = await minifyJs(js);
		expect(minified).toBe(js);
	});
});
