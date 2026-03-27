import * as f from '$lib/core/string-utils';

describe('toSnakeCase', () => {
	['helloWorld', 'hello-world', 'Hello World', 'hello.world'].forEach((input) => {
		it(`should convert "${input}" to "hello_world"`, () => {
			expect(f.toSnakeCase(input)).toBe('hello_world');
		});
	});
});

describe('toCamelCase', () => {
	['hello_world', 'hello-world', 'Hello World', 'hello.world'].forEach((input) => {
		it(`should convert "${input}" to "helloWorld"`, () => {
			expect(f.toCamelCase(input)).toBe('helloWorld');
		});
	});
});

describe('toPascalCase', () => {
	['hello_world', 'hello-world', 'hello world', 'hello.world'].forEach((input) => {
		it(`should convert "${input}" to "HelloWorld"`, () => {
			expect(f.toPascalCase(input)).toBe('HelloWorld');
		});
	});
});

describe('toTitleCase', () => {
	['hello world', 'HELLO WORLD', 'hElLo WoRlD'].forEach((input) => {
		it(`should convert "${input}" to "Hello World"`, () => {
			expect(f.toTitleCase(input)).toBe('Hello World');
		});
	});
});

describe('toKebabCase', () => {
	['helloWorld', 'hello_world', 'Hello World', 'hello.world'].forEach((input) => {
		it(`should convert "${input}" to "hello-world"`, () => {
			expect(f.toKebabCase(input)).toBe('hello-world');
		});
	});
});

describe('toConstantCase', () => {
	['helloWorld', 'hello-world', 'Hello World', 'hello.world'].forEach((input) => {
		it(`should convert "${input}" to "HELLO_WORLD"`, () => {
			expect(f.toConstantCase(input)).toBe('HELLO_WORLD');
		});
	});
});

describe('toDotCase', () => {
	['helloWorld', 'hello-world', 'Hello World', 'hello_world'].forEach((input) => {
		it(`should convert "${input}" to "hello.world"`, () => {
			expect(f.toDotCase(input)).toBe('hello.world');
		});
	});
});

describe('toSentenceCase', () => {
	['hello world', 'HELLO WORLD', 'hElLo WoRlD'].forEach((input) => {
		it(`should convert "${input}" to "Hello world"`, () => {
			expect(f.toSentenceCase(input)).toBe('Hello world');
		});
	});
});

describe('reverseString', () => {
	const cases: [string, string][] = [
		['hello', 'olleh'],
		['Hello World!', '!dlroW olleH'],
		['', ''],
		['a', 'a']
	];
	cases.forEach(([input, expected]) => {
		it(`should reverse "${input}" to "${expected}"`, () => {
			expect(f.reverseString(input)).toBe(expected);
		});
	});
});
