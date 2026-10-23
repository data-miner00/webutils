export type DocumentWriteMethod = 'write' | 'writeln';

export type QuoteStyle = 'single' | 'double';

type DocumentWriteOptions = {
	method: DocumentWriteMethod;
	quote: QuoteStyle;
};

function toStringLiteral(line: string, quote: QuoteStyle): string {
	const quoteChar = quote === 'single' ? "'" : '"';
	const escaped = line
		.replace(/\\/g, '\\\\')
		.replaceAll(quoteChar, `\\${quoteChar}`)
		// A literal </script> would close the inline <script> the output is pasted into
		.replace(/<\/(script)/gi, '<\\/$1');

	return quoteChar + escaped + quoteChar;
}

export function htmlToDocumentWrite(html: string, options: DocumentWriteOptions): string {
	const content = html.replace(/(\r?\n)+$/, '');

	if (!content) {
		return '';
	}

	return (
		content
			.split(/\r?\n/)
			// document.write('') is a no-op, but document.writeln('') still writes a line break
			.filter((line) => options.method === 'writeln' || line !== '')
			.map((line) => `document.${options.method}(${toStringLiteral(line, options.quote)});`)
			.join('\n')
	);
}

export const exampleHtmlToDocumentWrite = `<div class="card">
  <h2>Welcome back</h2>
  <p>You have <strong>3</strong> new messages.</p>
  <a href="/inbox">Open inbox</a>
</div>`;

export const exampleHtmlToDocumentWrite2 = `<p class='note'>It's a "quoted" path: C:\\temp</p>
<script src="/analytics.js"></script>
<pre>
line one

line three
</pre>`;
