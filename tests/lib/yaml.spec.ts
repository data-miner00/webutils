import { exampleYaml, yamlToJson } from '$lib/core/yaml';

describe('YAML', () => {
	it('should convert YAML to JSON correctly', () => {
		const input = exampleYaml;
		const expected = `{
  "person": {
    "name": "John Doe",
    "age": 30,
    "isStudent": false,
    "courses": [
      "Math",
      "Science",
      "History"
    ]
  },
  "address": {
    "street": "123 YAML Lane",
    "city": "Dataville",
    "zip": 90210,
    "coordinates": {
      "latitude": 34.0522,
      "longitude": -118.2437
    }
  },
  "employees": [
    {
      "id": 101,
      "name": "Alice"
    },
    {
      "id": 102,
      "name": "Bob"
    }
  ]
}`;
		const actual = yamlToJson(input, { indentSize: 2 });
		expect(actual).toBe(expected);
	});
});
