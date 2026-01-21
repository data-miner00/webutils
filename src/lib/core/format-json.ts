type JsonFormatOptions = {
	indentSize: number;
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

export const exampleFormatJson =
	'{"Id":78912,"Customer":"Jason Sweet", "Quantity":1,"Price":18.00}';

export const exampleFormatJson2 = '{"a":1, "b":2, "c":{"d":1, "e":[1,2]}}';
