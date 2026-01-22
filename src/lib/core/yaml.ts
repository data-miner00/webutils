import { parse, stringify } from 'yaml';
import { formatJson } from './format-json';

type Options = {
	indentSize: number;
};

export function yamlToJson(yaml: string, options: Options): string {
	if (!yaml) return yaml;

	const yamlObject = parse(yaml);

	return formatJson(JSON.stringify(yamlObject), {
		indentSize: options.indentSize
	});
}

export const exampleYaml = `# This is a YAML comment
person:
  name: John Doe
  age: 30
  isStudent: false # Boolean value
  courses:
    - Math
    - Science
    - History # A list of items

# Another object
address:
  street: 123 YAML Lane
  city: Dataville
  zip: 90210
  # Nested mapping within the address
  coordinates:
    latitude: 34.0522
    longitude: -118.2437

# List of objects (flow style)
employees: [{id: 101, name: Alice}, {id: 102, name: Bob}]
`;

export function jsonToYaml(json: string): string {
	const object = JSON.parse(json);
	return stringify(object);
}
