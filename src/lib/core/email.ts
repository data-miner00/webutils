// AI generated URLs, not tested except gmail
const emailProviderMap = new Map([
	['gmail', 'https://mail.google.com/mail/u/0/#inbox'],
	['outlook', 'https://outlook.live.com/mail/0/inbox'],
	['yahoo', 'https://mail.yahoo.com/d/folders/1'],
	['protonmail', 'https://mail.proton.me/u/0/inbox'],
	['icloud', 'https://www.icloud.com/mail'],
	['aol', 'https://mail.aol.com/webmail-std/en-us/suite'],
	['zoho', 'https://mail.zoho.com/zm/#mail/folder/inbox'],
	['gmx', 'https://www.gmx.com/#.1174131-header-naviloggedin1-3'],
	['yandex', 'https://mail.yandex.com/#inbox'],
	['fastmail', 'https://www.fastmail.com/mail/Inbox'],
	['tutanota', 'https://mail.tutanota.com/mail']
]);

export function extractEmailDomain(email: string): string | null {
	const match = email.match(/[a-zA-Z0-9_.+-]+@([a-zA-Z0-9_.-]+\.[a-zA-Z]{2,})/);

	if (match && match[1]) {
		return match[1];
	}

	return null;
}

export function getEmailProviderUrlFromEmail(email: string): string | null {
	const domain = extractEmailDomain(email);

	if (!domain) {
		return null;
	}

	const providerName = domain.split('.')[0];
	const providerUrl = emailProviderMap.get(providerName);

	return providerUrl || null;
}
