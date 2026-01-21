import beautify from 'js-beautify';

type CssFormatOptions = {
	indentSize: number;
};

export function formatCss(css: string, options: CssFormatOptions) {
	const formattedCss = beautify.css(css, {
		indent_size: options.indentSize,
		preserve_newlines: true
	});

	return formattedCss;
}

export const exampleFormatCss = `body
 {
margin: 0;
  padding: 0; font-family: Arial, sans-serif;
}`;

export const exampleFormatCss2 = `

body {  margin: 0; padding: 0; &::before { position:absolute;}}
h1 {
color: blue;
}

h2 {

color: pink;
font-size: 30px;
}
`;

export function minifyCss(css: string): string {
	return css.replace(/\s+/g, ' ').trim();
}
