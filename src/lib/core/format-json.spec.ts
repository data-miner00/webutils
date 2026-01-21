import { exampleFormatJson, formatJson } from './format-json';

describe('format JSON', () => {
	[
		{
			spacing: 4,
			expected: `{
    "Id": 78912,
    "Customer": "Jason Sweet",
    "Quantity": 1,
    "Price": 18
}`
		},
		{
			spacing: 2,
			expected: `{
  "Id": 78912,
  "Customer": "Jason Sweet",
  "Quantity": 1,
  "Price": 18
}`
		}
	].forEach((scenario) => {
		it('should format JSON correctly', () => {
			const input = exampleFormatJson;

			const actual = formatJson(input, { indentSize: scenario.spacing });
			expect(actual).toBe(scenario.expected);
		});
	});
});
