import type { Entity } from './types';
import usefulLinks from './useful-links.json';

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

const today = new Date().toISOString();

export const defaultLinks: Link[] = [];

for (const link of usefulLinks) {
	defaultLinks.push({
		...link,
		id: crypto.randomUUID(),
		createdAt: today
	});
}

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
