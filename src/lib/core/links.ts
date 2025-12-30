export type Link = {
	id?: number;
	category: string;
	title: string;
	description?: string;
	url: string;
	language?: string;
	favicon?: string;
	displayOrder?: number;
	createdAt: string;
};

const today = new Date();

export const defaultLinks: Link[] = [
	{
		title: 'ChatGPT',
		category: 'Tools',
		url: 'https://chatgpt.com',
		createdAt: today.toISOString()
	},
	{
		title: 'GitHub',
		category: 'Social',
		url: 'https://github.com/',
		createdAt: today.toISOString()
	},
	{
		title: 'YouTube',
		category: 'Social',
		url: 'https://youtube.com/',
		createdAt: today.toISOString()
	},
	{
		title: 'Wikipedia',
		category: 'Articles',
		url: 'https://wikipedia.org/',
		createdAt: today.toISOString()
	},
	{
		title: 'Hackernews',
		category: 'Articles',
		url: 'https://news.ycombinator.com/',
		createdAt: today.toISOString()
	},
	{
		title: 'Gmail',
		category: 'Tools',
		url: 'https://mail.google.com/',
		createdAt: today.toISOString()
	},
	{
		title: 'Regex101',
		category: 'Tools',
		url: 'https://regex101.com/',
		createdAt: today.toISOString()
	},
	{
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

const DATABASE_NAME = 'webutils';
const DATABASE_VERSION = 1;
const TABLE_NAME = 'links';

function openDB(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

		request.onupgradeneeded = () => {
			const db = request.result;

			if (!db.objectStoreNames.contains(TABLE_NAME)) {
				const store = db.createObjectStore(TABLE_NAME, {
					keyPath: 'id',
					autoIncrement: true
				});

				store.createIndex('urlIdx', 'url', { unique: true });
				store.createIndex('titleIdx', 'title');
				store.createIndex('createdAtIdx', 'createdAt');
			}
		};

		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

export async function addLink(link: Omit<Link, 'id'>): Promise<void> {
	const db = await openDB();
	const tx = db.transaction(TABLE_NAME, 'readwrite');
	const store = tx.objectStore(TABLE_NAME);

	store.put(link);

	tx.oncomplete = function () {
		db.close();
	};
}

export async function getLink(id: number): Promise<Link | undefined> {
	const db = await openDB();
	const tx = db.transaction(TABLE_NAME, 'readonly');
	const store = tx.objectStore(TABLE_NAME);

	return new Promise((resolve, reject) => {
		const request = store.get(id);
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

export async function getAllLinks(count?: number): Promise<Link[]> {
	const db = await openDB();
	const tx = db.transaction(TABLE_NAME, 'readonly');
	const store = tx.objectStore(TABLE_NAME);

	return new Promise((resolve, reject) => {
		const request = store.getAll(null, count);
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

export async function deleteLink(id: number): Promise<void> {
	const db = await openDB();
	const tx = db.transaction(TABLE_NAME, 'readwrite');
	const store = tx.objectStore(TABLE_NAME);

	store.delete(id);

	tx.oncomplete = function () {
		db.close();
	};
}
