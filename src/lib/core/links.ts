import type { Entity } from './types';

export type Link = {
	category: string;
	title: string;
	description?: string;
	url: string;
	language?: string;
	favicon?: string;
	displayOrder?: number;
	createdAt: string;
} & Entity;

const today = new Date();

export const defaultLinks: Link[] = [
	{
		id: crypto.randomUUID(),
		title: 'ChatGPT',
		category: 'Tools',
		url: 'https://chatgpt.com',
		createdAt: today.toISOString()
	},
	{
		id: crypto.randomUUID(),
		title: 'GitHub',
		category: 'Social',
		url: 'https://github.com/',
		createdAt: today.toISOString()
	},
	{
		id: crypto.randomUUID(),
		title: 'YouTube',
		category: 'Social',
		url: 'https://youtube.com/',
		createdAt: today.toISOString()
	},
	{
		id: crypto.randomUUID(),
		title: 'Wikipedia',
		category: 'Articles',
		url: 'https://wikipedia.org/',
		createdAt: today.toISOString()
	},
	{
		id: crypto.randomUUID(),
		title: 'Hackernews',
		category: 'Articles',
		url: 'https://news.ycombinator.com/',
		createdAt: today.toISOString()
	},
	{
		id: crypto.randomUUID(),
		title: 'Gmail',
		category: 'Tools',
		url: 'https://mail.google.com/',
		createdAt: today.toISOString()
	},
	{
		id: crypto.randomUUID(),
		title: 'Regex101',
		category: 'Tools',
		url: 'https://regex101.com/',
		createdAt: today.toISOString()
	},
	{
		id: crypto.randomUUID(),
		title: 'Diff Checker',
		category: 'Tools',
		url: 'https://www.diffchecker.com/',
		createdAt: today.toISOString()
	}
];

/**
 * Extract domain from a URL. Regex implementation: `:\/\/([^\/\n]+)`
 * @param url The url to extract.
 * @returns The extracted domain.
 */
export function extractDomain(url: string): string {
	try {
		return new URL(url).host;
	} catch {
		return 'example.com';
	}
}

export const STORE_NAME = 'links';
