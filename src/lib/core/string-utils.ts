export function toSnakeCase(str: string): string {
	return str
		.replace(/([a-z])([A-Z])/g, '$1_$2')
		.replace(/[\s\-\.]+/g, '_')
		.toLowerCase()
		.replace(/[^a-z0-9_]/g, '');
}

export function toCamelCase(str: string): string {
	return str
		.replace(/[\s\-_\.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
		.replace(/^[A-Z]/, (c) => c.toLowerCase())
		.replace(/[^a-zA-Z0-9]/g, '');
}

export function toPascalCase(str: string): string {
	return str
		.replace(/[\s\-_\.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
		.replace(/^[a-z]/, (c) => c.toUpperCase())
		.replace(/[^a-zA-Z0-9]/g, '');
}

export function toTitleCase(str: string): string {
	return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

export function toKebabCase(str: string): string {
	return str
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.replace(/[\s_\.]+/g, '-')
		.toLowerCase()
		.replace(/[^a-z0-9\-]/g, '');
}

export function toConstantCase(str: string): string {
	return toSnakeCase(str).toUpperCase();
}

export function toDotCase(str: string): string {
	return str
		.replace(/([a-z])([A-Z])/g, '$1.$2')
		.replace(/[\s\-_]+/g, '.')
		.toLowerCase()
		.replace(/[^a-z0-9\.]/g, '');
}

export function toSentenceCase(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function reverseString(str: string): string {
	return str.split('').reverse().join('');
}
