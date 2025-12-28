export type IpInfo = {
	ip: string;
	city: string;
	country: string;
};

type IpInfoResponse = {
	ip: string;
	city: string;
	country: string;
	region: string;
	loc: string;
	org: string;
	postal: string;
	timezone: string;
	readme: string;
};

export async function fetchIpInfo(): Promise<IpInfo> {
	const COOKIE_NAME = 'ipinfo_cache_v1';
	const MAX_AGE_SECONDS = 24 * 60 * 60; // 1 day

	const raw = getCookie(COOKIE_NAME);
	if (raw) {
		try {
			const parsed = JSON.parse(decodeURIComponent(raw));
			if (parsed && typeof parsed.ts === 'number' && parsed.data) {
				if (Date.now() - parsed.ts < MAX_AGE_SECONDS * 1000) {
					console.log('Using cached Ip info');
					return parsed.data as IpInfo;
				}
			}
		} catch (e) {
			// swallow JSON parse errors and continue to fetch
		}
	}

	const response = await fetch('https://ipinfo.io/json');
	const body = (await response.json()) as IpInfoResponse;

	const result: IpInfo = {
		ip: body.ip,
		city: body.city,
		country: body.country
	};

	try {
		const payload = JSON.stringify({ ts: Date.now(), data: result });
		setCookie(COOKIE_NAME, encodeURIComponent(payload), MAX_AGE_SECONDS);
	} catch (e) {
		// ignore cookie set failures
	}

	return result;
}

function getCookie(name: string): string | null {
	if (typeof document === 'undefined') return null;
	const pairs = document.cookie ? document.cookie.split('; ') : [];
	for (const p of pairs) {
		if (p.startsWith(name + '=')) return p.substring(name.length + 1);
	}
	return null;
}

function setCookie(name: string, value: string, maxAgeSeconds?: number) {
	if (typeof document === 'undefined') return;
	let cookie = `${name}=${value};path=/;SameSite=Lax`;
	if (typeof maxAgeSeconds === 'number') cookie += `;max-age=${maxAgeSeconds}`;
	if (typeof location !== 'undefined' && location.protocol === 'https:') cookie += ';secure';
	document.cookie = cookie;
}
