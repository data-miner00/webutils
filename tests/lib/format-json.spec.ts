import {
	exampleFormatJson,
	exampleMinifyJson,
	formatJson,
	minifyJson
} from '$lib/core/format-json';

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
			const input = exampleFormatJson.json;

			const actual = formatJson(input, { indentSize: scenario.spacing });
			expect(actual).toBe(scenario.expected);
		});
	});

	it('should minify JSON correctly', () => {
		const input = exampleMinifyJson.json;
		const expected = `{"name":"Molecule Man","age":29,"secretIdentity":"Dan Jukes","powers":["Radiation resistance","Turning tiny","Radiation blast"],"address":{"street":"123 Main St","city":"Anytown"}}`;

		const actual = minifyJson(input);
		expect(actual).toBe(expected);
	});
});
