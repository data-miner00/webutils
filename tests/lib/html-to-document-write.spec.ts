import { htmlToDocumentWrite } from '$lib/core/html-to-document-write';

describe('htmlToDocumentWrite', () => {
	const single = { method: 'write', quote: 'single' } as const;

	it('should wrap each line in a document.write call', () => {
		expect(htmlToDocumentWrite('<div>\n  <p>Hi</p>\n</div>', single)).toBe(
			[
				"document.write('<div>');",
				"document.write('  <p>Hi</p>');",
				"document.write('</div>');"
			].join('\n')
		);
	});

	it('should handle CRLF line endings', () => {
		expect(htmlToDocumentWrite('<b>a</b>\r\n<i>b</i>', single)).toBe(
			"document.write('<b>a</b>');\ndocument.write('<i>b</i>');"
		);
	});

	it('should return an empty string for empty input', () => {
		expect(htmlToDocumentWrite('', single)).toBe('');
		expect(htmlToDocumentWrite('\n\n', single)).toBe('');
		expect(htmlToDocumentWrite('', { method: 'writeln', quote: 'single' })).toBe('');
	});

	it('should skip empty lines for document.write', () => {
		expect(htmlToDocumentWrite('<p>a</p>\n\n<p>b</p>\n', single)).toBe(
			"document.write('<p>a</p>');\ndocument.write('<p>b</p>');"
		);
	});

	it('should keep empty lines for document.writeln', () => {
		expect(htmlToDocumentWrite('<pre>a\n\nb</pre>\n', { method: 'writeln', quote: 'single' })).toBe(
			"document.writeln('<pre>a');\ndocument.writeln('');\ndocument.writeln('b</pre>');"
		);
	});

	it('should escape single quotes and backslashes', () => {
		expect(htmlToDocumentWrite(`<p class="x">It's C:\\temp</p>`, single)).toBe(
			`document.write('<p class="x">It\\'s C:\\\\temp</p>');`
		);
	});

	it('should escape double quotes when using double quote style', () => {
		expect(htmlToDocumentWrite(`<a href="/">It's</a>`, { method: 'write', quote: 'double' })).toBe(
			`document.write("<a href=\\"/\\">It's</a>");`
		);
	});

	it('should escape closing script tags', () => {
		expect(htmlToDocumentWrite('<script src="a.js"></SCRIPT>', single)).toBe(
			`document.write('<script src="a.js"><\\/SCRIPT>');`
		);
	});

	it('should produce JavaScript that writes the original HTML back', () => {
		const html = `<p class='a'>It's "x" \\ y</p>\n<script>1</script>`;
		const written: string[] = [];
		const document = { write: (s: string) => written.push(s) };

		new Function('document', htmlToDocumentWrite(html, single))(document);

		expect(written.join('\n')).toBe(html);
	});
});
