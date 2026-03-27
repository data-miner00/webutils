import { markdownToHtml } from '$lib/core/markdown';

describe('markdownToHtml', () => {
	it('should convert markdown to HTML', async () => {
		const markdown = `# Hello World
This is a **markdown** example.

- Item 1
- Item 2
- Item 3
\`\`\`javascript
console.log('Hello, world!');
\`\`\``;
		const expectedHtml = `<h1>Hello World</h1>
<p>This is a <strong>markdown</strong> example.</p>
<ul>
<li>Item 1</li>
<li>Item 2</li>
<li>Item 3</li>
</ul>
<pre><code class="language-javascript">console.log(&#39;Hello, world!&#39;);
</code></pre>
`;
		const html = await markdownToHtml(markdown);
		expect(html).toBe(expectedHtml);
	});

	it('should handle empty markdown', async () => {
		const markdown = '';
		const expectedHtml = '';
		const html = await markdownToHtml(markdown);
		expect(html).toBe(expectedHtml);
	});
});
