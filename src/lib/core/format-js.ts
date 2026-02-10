import beautify from 'js-beautify';
import { minify } from 'terser';

type Example = {
	input: string;
	mode: 'format' | 'minify';
};

type JsFormatOptions = {
	indentSize: number;
};

export function formatJs(js: string, options: JsFormatOptions) {
	const formattedJs = beautify.js(js, {
		indent_size: options.indentSize,
		preserve_newlines: true,
		keep_array_indentation: true
	});

	return formattedJs;
}

export const exampleFormatJs: Example = {
	input: `function helloWorld(   name,age)
{
	return \`Hello \${name}, you are \${age} years old.\`;
}`,
	mode: 'format'
};

export const exampleFormatJs2: Example = {
	input: `console.log('hello'); var age = 32; function getAge(age) { return age; }`,
	mode: 'format'
};

export async function minifyJs(js: string) {
	try {
		const output = await minify(js);
		return output.code!;
	} catch (err) {
		return js;
	}
}

export const exampleMinifyJs: Example = {
	input: `function add(a, b) {
	return a + b;
}
console.log(add(2, 3));`,
	mode: 'minify'
};
