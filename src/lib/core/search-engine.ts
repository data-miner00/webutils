export type SearchEngine = {
	faviconUrl: string;
	id: string;
	name: string;
	searchUrl: string;
};

export const searchEngines: SearchEngine[] = [
	{
		id: 'google',
		faviconUrl: 'https://www.google.com/favicon.ico',
		name: 'Google',
		searchUrl: 'https://www.google.com/search?q='
	},
	{
		id: 'bing',
		faviconUrl: 'https://www.bing.com/favicon.ico',
		name: 'Bing',
		searchUrl: 'https://www.bing.com/search?q='
	},
	{
		id: 'yahoo',
		faviconUrl: 'https://search.yahoo.com/favicon.ico',
		name: 'Yahoo',
		searchUrl: 'https://search.yahoo.com/search?p='
	},
	{
		id: 'duckduckgo',
		faviconUrl: 'https://duckduckgo.com/favicon.ico',
		name: 'DuckDuckGo',
		searchUrl: 'https://duckduckgo.com/?q='
	},
	{
		id: 'qwant',
		faviconUrl: 'https://www.qwant.com/favicon.ico',
		name: 'Qwant',
		searchUrl: 'https://www.qwant.com/?q='
	},
	{
		id: 'yandex',
		faviconUrl: 'https://yandex.com/favicon.ico',
		name: 'Yandex',
		searchUrl: 'https://yandex.com/search/?text='
	},
	{
		id: 'baidu',
		faviconUrl: 'https://www.baidu.com/favicon.ico',
		name: 'Baidu',
		searchUrl: 'https://www.baidu.com/s?wd='
	}
];
