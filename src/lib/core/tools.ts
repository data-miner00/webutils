export type Tool = {
	title: string;
	url: string;
	category: string;
};

export const tools: Tool[] = [
	{ title: 'QR Code Generator', url: '/tools/qr-code-generator', category: 'General' },
	{ title: 'Unit Converter', url: '/tools/unit-converter', category: 'General' },
	{ title: 'Timer & Stopwatch', url: '/tools/timer-stopwatch', category: 'General' },
	{ title: 'URL Parser', url: '/tools/url-parser', category: 'General' },
	{ title: 'UUID Generator', url: '/tools/uuid', category: 'General' },
	{ title: 'Timestamp Converter', url: '/tools/timestamp-converter', category: 'General' },
	{ title: 'Base Converter', url: '/tools/base-converter', category: 'General' },

	{ title: 'Base64 Image Converter', url: '/tools/base64-image', category: 'Image' },
	{
		title: 'Image Format Converter',
		url: '/tools/image-format-converter',
		category: 'Image'
	},
	{ title: 'Image Resizer', url: '/tools/image-resizer', category: 'Image' },
	{ title: 'Image Compressor', url: '/tools/image-compressor', category: 'Image' },

	{ title: 'Leading Space Remover', url: '/tools/leading-space-remover', category: 'Code Review' },
	{
		title: 'Trailing Space Remover',
		url: '/tools/trailing-space-remover',
		category: 'Code Review'
	},
	{ title: 'Text Diff', url: '/tools/text-diff', category: 'Code Review' },
	{ title: 'Empty Line Remover', url: '/tools/empty-line-remover', category: 'Code Review' },

	{ title: 'JWT Debugger', url: '/tools/jwt-debugger', category: 'Security & Auth' },
	{
		title: 'Certificate Decoder',
		url: '/tools/certificate-decoder',
		category: 'Security & Auth'
	},
	{
		title: 'Card & Email Validator',
		url: '/tools/card-email-validator',
		category: 'Security & Auth'
	},
	{ title: 'Caesar Cipher', url: '/tools/caesar-cipher', category: 'Security & Auth' },
	{ title: 'Morse Code Translator', url: '/tools/morse-code', category: 'Security & Auth' },
	{ title: 'Vigenère Cipher', url: '/tools/vigenere-cipher', category: 'Security & Auth' },

	{ title: 'String Transform', url: '/tools/string-transform', category: 'Text' },
	{ title: 'Text Stats', url: '/tools/text-stats', category: 'Text' },
	{ title: 'Hash Generator', url: '/tools/hash-generator', category: 'Text' },
	{ title: 'Unicode to Hex', url: '/tools/unicode-hex', category: 'Text' },
	{ title: 'Sort list', url: '/tools/sort-list', category: 'Text' },
	{ title: 'Base64 Encoder/Decoder', url: '/tools/base64-encoder-decoder', category: 'Text' },
	{ title: 'Newline Escaper', url: '/tools/newline-escaper', category: 'Text' },

	{ title: 'Whiteboard', url: '/tools/whiteboard', category: 'Discussion' },

	{ title: 'CSS Formatter', url: '/tools/css-formatter', category: 'Web' },
	{ title: 'HTML Viewer', url: '/tools/html-viewer', category: 'Web' },
	{ title: 'HTML Formatter', url: '/tools/html-formatter', category: 'Web' },
	{ title: 'JavaScript Formatter', url: '/tools/js-formatter', category: 'Web' },
	{ title: 'JSON Formatter', url: '/tools/json-formatter', category: 'Web' },
	{ title: 'Markdown Viewer', url: '/tools/markdown-viewer', category: 'Web' },
	{ title: 'SQL Formatter', url: '/tools/sql-formatter', category: 'Web' },
	{ title: 'YAML to JSON Converter', url: '/tools/yaml-to-json', category: 'Web' },
	{ title: 'JSON to XML Converter', url: '/tools/json-to-xml', category: 'Web' },

	{ title: 'Lorem Ipsum Generator', url: '/tools/lorem-ipsum-generator', category: 'Design' },
	{ title: 'Color Converter', url: '/tools/color-converter', category: 'Design' },

	{ title: 'Localhost Manager', url: '/tools/localhost-manager', category: 'Development' },

	{ title: 'World Clock', url: '/tools/world-clock', category: 'Lookup' },
	{ title: 'Emoji Picker', url: '/tools/emoji-picker', category: 'Lookup' },
	{ title: 'Unicode Lookup', url: '/tools/unicode-lookup', category: 'Lookup' },
	{ title: 'Country Lookup', url: '/tools/country-lookup', category: 'Lookup' },
	{ title: 'Calendar', url: '/tools/calendar', category: 'Lookup' },
	{ title: 'HTTP Status Code Lookup', url: '/tools/http-status-codes', category: 'Lookup' },
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
