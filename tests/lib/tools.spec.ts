import { findToolByUrl, searchTools, toggleFavorite, upsertRecent } from '$lib/core/tools';

const sampleTools = [
	{ title: 'UUID Generator', url: '/tools/uuid', category: 'General' },
	{ title: 'JSON Formatter', url: '/tools/json', category: 'Web' },
	{ title: 'JWT Debugger', url: '/tools/jwt-debugger', category: 'Security & Auth' }
];

describe('searchTools', () => {
	it('matches by title case-insensitively', () => {
		expect(searchTools('uuid', sampleTools)).toEqual([sampleTools[0]]);
		expect(searchTools('UUID', sampleTools)).toEqual([sampleTools[0]]);
	});

	it('matches by category', () => {
		expect(searchTools('security', sampleTools)).toEqual([sampleTools[2]]);
	});

	it('returns an empty array for an empty or blank query', () => {
		expect(searchTools('', sampleTools)).toEqual([]);
		expect(searchTools('   ', sampleTools)).toEqual([]);
	});

	it('returns an empty array when nothing matches', () => {
		expect(searchTools('nonexistent', sampleTools)).toEqual([]);
	});
});

describe('findToolByUrl', () => {
	it('finds a tool by its exact url', () => {
		expect(findToolByUrl('/tools/json', sampleTools)).toEqual(sampleTools[1]);
	});

	it('returns undefined when the url is not found', () => {
		expect(findToolByUrl('/tools/missing', sampleTools)).toBeUndefined();
	});
});

describe('upsertRecent', () => {
	it('adds a new url to the front', () => {
		expect(upsertRecent(['/a', '/b'], '/c')).toEqual(['/c', '/a', '/b']);
	});

	it('moves an existing url to the front instead of duplicating it', () => {
		expect(upsertRecent(['/a', '/b', '/c'], '/b')).toEqual(['/b', '/a', '/c']);
	});

	it('caps the list to the max size', () => {
		expect(upsertRecent(['/a', '/b', '/c'], '/d', 3)).toEqual(['/d', '/a', '/b']);
	});
});

describe('toggleFavorite', () => {
	it('adds a url that is not yet favorited', () => {
		expect(toggleFavorite(['/a'], '/b')).toEqual(['/b', '/a']);
	});

	it('removes a url that is already favorited', () => {
		expect(toggleFavorite(['/a', '/b'], '/a')).toEqual(['/b']);
	});
});
