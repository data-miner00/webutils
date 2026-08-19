export type Tool = {
	title: string;
	url: string;
	category: string;
};

export const tools: Tool[] = [
	{ title: 'QR Code', url: '/tools/qr-code', category: 'General' },
	{ title: 'Unit Conversion', url: '/tools/conversion', category: 'General' },
	{ title: 'Timer / Stopwatch', url: '/tools/timer', category: 'General' },
	{ title: 'URL Parser', url: '/tools/url-parser', category: 'General' },
	{ title: 'UUID Generator', url: '/tools/uuid', category: 'General' },
	{ title: 'Timestamp', url: '/tools/timestamp', category: 'General' },
	{ title: 'Base Converter', url: '/tools/baseN', category: 'General' },

	{ title: 'Base64 Image Converter', url: '/tools/base64-image', category: 'Image' },
	{ title: 'Image Format Converter', url: '/tools/image-converter', category: 'Image' },
	{ title: 'Image Resizer', url: '/tools/image-resizer', category: 'Image' },
	{ title: 'Image Compressor', url: '/tools/image-compressor', category: 'Image' },

	{ title: 'Leading Space', url: '/tools/leading-space', category: 'Code Review' },
	{ title: 'Trailing Space', url: '/tools/trailing-space', category: 'Code Review' },
	{ title: 'Text Diff', url: '/tools/text-diff', category: 'Code Review' },
	{ title: 'Empty Line Remover', url: '/tools/empty-line-remover', category: 'Code Review' },

	{ title: 'JWT Debugger', url: '/tools/jwt-debugger', category: 'Security & Auth' },
	{ title: 'Certificate Decoder', url: '/tools/certificate', category: 'Security & Auth' },
	{ title: 'Verify', url: '/tools/verify', category: 'Security & Auth' },
	{ title: 'Caesar Cipher', url: '/tools/caesar', category: 'Security & Auth' },
	{ title: 'Morse Code Translator', url: '/tools/morse-code', category: 'Security & Auth' },
	{ title: 'Vigenère Cipher', url: '/tools/vigenere', category: 'Security & Auth' },

	{ title: 'String Transform', url: '/tools/strings', category: 'Text' },
	{ title: 'Text Stats', url: '/tools/text-stats', category: 'Text' },
	{ title: 'Hash String', url: '/tools/hash', category: 'Text' },
	{ title: 'Unicode to Hex', url: '/tools/unicode-hex', category: 'Text' },
	{ title: 'Sort list', url: '/tools/sort-list', category: 'Text' },
	{ title: 'Base64', url: '/tools/base64', category: 'Text' },
	{ title: 'Newline Escape', url: '/tools/newline-escaper', category: 'Text' },

	{ title: 'Draw', url: '/tools/draw', category: 'Discussion' },

	{ title: 'CSS Formatter', url: '/tools/css', category: 'Web' },
	{ title: 'HTML Viewer', url: '/tools/html-viewer', category: 'Web' },
	{ title: 'HTML Formatter', url: '/tools/html', category: 'Web' },
	{ title: 'JavaScript Formatter', url: '/tools/js', category: 'Web' },
	{ title: 'JSON Formatter', url: '/tools/json', category: 'Web' },
	{ title: 'Markdown Viewer', url: '/tools/markdown-viewer', category: 'Web' },
	{ title: 'SQL Formatter', url: '/tools/sql', category: 'Web' },
	{ title: 'YAML to JSON', url: '/tools/yaml', category: 'Web' },
	{ title: 'XML Converter', url: '/tools/xml', category: 'Web' },

	{ title: 'Lorem Ipsum', url: '/tools/lorem', category: 'Design' },
	{ title: 'Color Converter', url: '/tools/color-converter', category: 'Design' },

	{ title: 'Localhost', url: '/tools/localhost', category: 'Development' },

	{ title: 'Clock', url: '/tools/clock', category: 'Lookup' },
	{ title: 'Emoji', url: '/tools/emoji', category: 'Lookup' },
	{ title: 'Unicode', url: '/tools/unicode', category: 'Lookup' },
	{ title: 'Country', url: '/tools/country', category: 'Lookup' },
	{ title: 'Calendar', url: '/tools/calendar', category: 'Lookup' },
	{ title: 'HTTP Code', url: '/tools/http-code', category: 'Lookup' },
	{ title: 'Weather', url: '/tools/weather', category: 'Lookup' }
];

export function searchTools(query: string, list: Tool[] = tools): Tool[] {
	const normalized = query.trim().toLowerCase();
	if (!normalized) return [];

	return list.filter(
		(tool) =>
			tool.title.toLowerCase().includes(normalized) ||
			tool.category.toLowerCase().includes(normalized)
	);
}

export function findToolByUrl(url: string, list: Tool[] = tools): Tool | undefined {
	return list.find((tool) => tool.url === url);
}

export function upsertRecent(list: string[], url: string, max = 10): string[] {
	return [url, ...list.filter((existing) => existing !== url)].slice(0, max);
}

export function toggleFavorite(list: string[], url: string): string[] {
	return list.includes(url) ? list.filter((existing) => existing !== url) : [url, ...list];
}
