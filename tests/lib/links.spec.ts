import { extractDomain } from '$lib/core/links';

describe('Extract Domain', () => {
	[
		{
			url: 'http://google.com',
			expected: 'google.com'
		},
		{
			url: 'https://google.com',
			expected: 'google.com'
		},
		{
			url: 'https://google.com/',
			expected: 'google.com'
		},
		{
			url: 'https://www.google.com/',
			expected: 'www.google.com'
		},
		{
			url: 'https://google.com?hello=1&bye=2',
			expected: 'google.com'
		},
		{
			url: 'https://google.com/blog/html/v1/my.html',
			expected: 'google.com'
		},
		{
			url: 'https://google.com/?hello=1',
			expected: 'google.com'
		},
		{
			url: '',
			expected: 'example.com'
		}
	].forEach((scenario) => {
		it(`should extract the correct domain: '${scenario.url}'`, () => {
			const actual = extractDomain(scenario.url);
			expect(actual).toBe(scenario.expected);
		});
	});
});
