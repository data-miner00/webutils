import { json2xml } from 'xml-js';
import buffer from 'buffer';

try {
	window.Buffer = buffer.Buffer;
} catch (error) {
	// Node.js environment
}

type JsonToXmlOptions = {
	indentSize: number;
};

export function jsonToXml(json: string, options?: JsonToXmlOptions): string {
	if (!json) return '<error>Input is empty</error>';

	try {
		return json2xml(json, {
			spaces: options?.indentSize ?? 2,
			compact: true
		});
	} catch (error) {
		return `<error>Failed to convert JSON to XML: ${(error as Error).message}</error>`;
	}
}

export const exampleJson = `{
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
}`;
