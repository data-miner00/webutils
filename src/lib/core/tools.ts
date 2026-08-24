export type Tool = {
	title: string;
	url: string;
	category: string;
};

type ToolEntry = Omit<Tool, 'category'>;

const generalTools: ToolEntry[] = [
	{ title: 'QR Code Generator', url: '/tools/qr-code-generator' },
	{ title: 'Unit Converter', url: '/tools/unit-converter' },
	{ title: 'Timer & Stopwatch', url: '/tools/timer-stopwatch' },
	{ title: 'URL Parser', url: '/tools/url-parser' },
	{ title: 'UUID Generator', url: '/tools/uuid' },
	{ title: 'Timestamp Converter', url: '/tools/timestamp-converter' },
	{ title: 'Base Converter', url: '/tools/base-converter' }
];

const imageTools: ToolEntry[] = [
	{ title: 'Base64 Image Converter', url: '/tools/base64-image' },
	{ title: 'Image Format Converter', url: '/tools/image-format-converter' },
	{ title: 'Image Resizer', url: '/tools/image-resizer' },
	{ title: 'Image Compressor', url: '/tools/image-compressor' }
];

const codeReviewTools: ToolEntry[] = [
	{ title: 'Leading Space Remover', url: '/tools/leading-space-remover' },
	{ title: 'Trailing Space Remover', url: '/tools/trailing-space-remover' },
	{ title: 'Text Diff', url: '/tools/text-diff' },
	{ title: 'Empty Line Remover', url: '/tools/empty-line-remover' }
];

const securityTools: ToolEntry[] = [
	{ title: 'JWT Debugger', url: '/tools/jwt-debugger' },
	{ title: 'Certificate Decoder', url: '/tools/certificate-decoder' },
	{ title: 'Card & Email Validator', url: '/tools/card-email-validator' },
	{ title: 'Caesar Cipher', url: '/tools/caesar-cipher' },
	{ title: 'Morse Code Translator', url: '/tools/morse-code' },
	{ title: 'Vigenère Cipher', url: '/tools/vigenere-cipher' }
];

const textTools: ToolEntry[] = [
	{ title: 'String Transform', url: '/tools/string-transform' },
	{ title: 'Text Stats', url: '/tools/text-stats' },
	{ title: 'Hash Generator', url: '/tools/hash-generator' },
	{ title: 'Unicode to Hex', url: '/tools/unicode-hex' },
	{ title: 'Sort list', url: '/tools/sort-list' },
	{ title: 'Base64 Encoder/Decoder', url: '/tools/base64-encoder-decoder' },
	{ title: 'Newline Escaper', url: '/tools/newline-escaper' }
];

const discussionTools: ToolEntry[] = [{ title: 'Whiteboard', url: '/tools/whiteboard' }];

const webTools: ToolEntry[] = [
	{ title: 'CSS Formatter', url: '/tools/css-formatter' },
	{ title: 'HTML Viewer', url: '/tools/html-viewer' },
	{ title: 'HTML Formatter', url: '/tools/html-formatter' },
	{ title: 'JavaScript Formatter', url: '/tools/js-formatter' },
	{ title: 'JSON Formatter', url: '/tools/json-formatter' },
	{ title: 'Markdown Viewer', url: '/tools/markdown-viewer' },
	{ title: 'SQL Formatter', url: '/tools/sql-formatter' },
	{ title: 'YAML to JSON Converter', url: '/tools/yaml-to-json' },
	{ title: 'JSON to XML Converter', url: '/tools/json-to-xml' }
];

const designTools: ToolEntry[] = [
	{ title: 'Lorem Ipsum Generator', url: '/tools/lorem-ipsum-generator' },
	{ title: 'Color Converter', url: '/tools/color-converter' }
];

const developmentTools: ToolEntry[] = [
	{ title: 'Localhost Manager', url: '/tools/localhost-manager' }
];

const lookupTools: ToolEntry[] = [
	{ title: 'World Clock', url: '/tools/world-clock' },
	{ title: 'Emoji Picker', url: '/tools/emoji-picker' },
	{ title: 'Unicode Lookup', url: '/tools/unicode-lookup' },
	{ title: 'Country Lookup', url: '/tools/country-lookup' },
	{ title: 'Calendar', url: '/tools/calendar' },
	{ title: 'HTTP Status Code Lookup', url: '/tools/http-status-codes' },
	{ title: 'Weather', url: '/tools/weather' }
];

const categorizedTools: [string, ToolEntry[]][] = [
	['General', generalTools],
	['Image', imageTools],
	['Code Review', codeReviewTools],
	['Security & Auth', securityTools],
	['Text', textTools],
	['Discussion', discussionTools],
	['Web', webTools],
	['Design', designTools],
	['Development', developmentTools],
	['Lookup', lookupTools]
];

export const tools: Tool[] = categorizedTools.flatMap(([category, entries]) =>
	entries.map((entry) => ({ ...entry, category }))
);

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
