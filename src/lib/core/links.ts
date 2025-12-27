export type Link = {
	id: number;
	category: string;
	title: string;
	description?: string;
	url: string;
	language?: string;
	favicon?: string;
	createdAt: string;
};

export const defaultLinks: Link[] = [
	{
		id: 1,
		title: 'ChatGPT',
		category: 'Tools',
		url: 'https://chatgpt.com',
		favicon: '',
		createdAt: new Date().toDateString()
	},
	{
		id: 2,
		title: 'GitHub',
		category: 'Social',
		url: 'https://github.com/',
		createdAt: new Date().toDateString()
	},
	{
		id: 3,
		title: 'YouTube',
		category: 'Social',
		url: 'https://youtube.com/',
		createdAt: new Date().toDateString()
	},
	{
		id: 4,
		title: 'Wikipedia',
		category: 'Articles',
		url: 'https://wikipedia.org/',
		createdAt: new Date().toDateString()
	},
	{
		id: 5,
		title: 'Hackernews',
		category: 'Articles',
		url: 'https://news.ycombinator.com/',
		createdAt: new Date().toDateString()
	},
	{
		id: 6,
		title: 'Gmail',
		category: 'Tools',
		url: 'https://mail.google.com/',
		createdAt: new Date().toDateString()
	}
];

export function extractDomain(url: string): string {
	const [_, domain] = /:\/\/(.*?)\//.exec(url) || ['', 'example.com'];
	return domain;
}
