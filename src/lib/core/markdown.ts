import { marked } from 'marked';

export async function markdownToHtml(markdown: string): Promise<string> {
	const result = marked.parse(markdown);

	if (result instanceof Promise) {
		const html = await result;
		return html;
	} else {
		return result;
	}
}

export const exampleMarkdown = `# Hello World

This is a **markdown** example.

- Item 1
- Item 2
- Item 3

\`\`\`javascript
console.log('Hello, world!');
\`\`\`
`;

export const exampleMarkdown2 = `# Sample Markdown

This is a sample markdown document to demonstrate the markdown viewer.

## Features

- **Headings**: Use \`#\` for headings.
- **Lists**: Create lists with \`-\` or \`*\`.
- **Code Blocks**: Use triple backticks for code blocks.

\`\`\`python
def greet(name):
    return f"Hello, {name}!"
\`\`\`

## Links

You can also include [links](https://www.example.com) in your markdown.
`;
