type JsonFormatOptions = {
	indentSize: number;
};

type Example = {
	json: string;
	mode: 'format' | 'minify';
};

export function formatJson(json: string, options: JsonFormatOptions): string {
	if (!json) return json;

	try {
		const parsedObject = JSON.parse(json);
		const stringifiedReadableJson = JSON.stringify(parsedObject, null, options.indentSize);
		return stringifiedReadableJson;
	} catch {
		return '{ "error": "Failed to parse JSON" }';
	}
}

export const exampleFormatJson: Example = {
	json: '{"Id":78912,"Customer":"Jason Sweet", "Quantity":1,"Price":18.00}',
	mode: 'format'
};

export const exampleFormatJson2: Example = {
	json: '{"a":1, "b":2, "c":{"d":1, "e":[1,2]}}',
	mode: 'format'
};

export function minifyJson(json: string): string {
	if (!json) return json;

	const minifiedJson = JSON.stringify(JSON.parse(json));
	return minifiedJson;
}

export const exampleMinifyJson: Example = {
	json: `{
  "name": "Molecule Man",
  "age": 29,
  "secretIdentity": "Dan Jukes",
  "powers": [
    "Radiation resistance",
    "Turning tiny",
    "Radiation blast"
  ],
  "address": {
    "street": "123 Main St",
    "city": "Anytown"
  }
}`,
	mode: 'minify'
};
