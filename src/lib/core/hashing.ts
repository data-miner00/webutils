import pkg from 'crypto-js';
const { MD5, SHA1, SHA256, SHA384, SHA512 } = pkg;

export function md5(data: string): string {
	return MD5(data).toString();
}

export function sha1(data: string): string {
	return SHA1(data).toString();
}

export function sha256(data: string): string {
	return SHA256(data).toString();
}

export function sha384(data: string): string {
	return SHA384(data).toString();
}

export function sha512(data: string): string {
	return SHA512(data).toString();
}

export function base64Encode(data: string): string {
	return btoa(unescape(encodeURIComponent(data)));
}

export function hex(data: string): string {
	let hex = '';
	for (let i = 0; i < data.length; i++) {
		hex += data.charCodeAt(i).toString(16).padStart(2, '0');
	}
	return hex;
}
