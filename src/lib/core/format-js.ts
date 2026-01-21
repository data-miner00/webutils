import beautify from 'js-beautify';

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

export const exampleFormatJs = `function helloWorld(   name,age)
{
	return \`Hello \${name}, you are \${age} years old.\`;
}`;

export const exampleFormatJs2 = `console.log('hello'); var age = 32; function getAge(age) { return age; }`;
