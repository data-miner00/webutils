import beautify from 'js-beautify';

type HtmlFormatOptions = {
	indentSize: number;
};

export function formatHtml(html: string, options: HtmlFormatOptions) {
	const formattedHtml = beautify.html(html, {
		indent_size: options.indentSize,
		preserve_newlines: true
	});

	return formattedHtml;
}

export const exampleFormatHtml = `
<html><head><title>Hello</title><style>body { color: blue; }</style></head>

<body>
<h1>Hello world</h1><p>This is a paragraph</p></body></html>`;

export const exampleFormatHtml2 = `
<div class="hello world">
<div class="bye world">
<div class="nested">
<h1>Hello World</h1>
</div>
</div>
</div>
`;

export function minifyHtml(css: string): string {
	return css.replace(/\s+/g, ' ').trim();
}
