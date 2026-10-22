export const example1 = 'https://www.youtube.com';
export const example2 = crypto.randomUUID();
export const example3 = 'This is a test string for QR code generation.';

export type WifiSecurity = 'WPA' | 'WEP' | 'nopass';

export type WifiConfig = {
	ssid: string;
	security: WifiSecurity;
	password: string;
	hidden: boolean;
};

export const wifiExample: WifiConfig = {
	ssid: 'Home Network',
	security: 'WPA',
	password: 'correct-horse-battery-staple',
	hidden: false
};

// Characters with special meaning in the WIFI: format must be backslash-escaped
function escapeWifiValue(value: string): string {
	return value.replace(/([\\;,":])/g, '\\$1');
}

// WIFI:T:<AUTH_TYPE>;S:<SSID>;P:<PASSWORD>;H:<HIDDEN>;;
export function toWifiConnectionString({ ssid, security, password, hidden }: WifiConfig): string {
	let result = `WIFI:T:${security};S:${escapeWifiValue(ssid)};`;

	if (security !== 'nopass') {
		result += `P:${escapeWifiValue(password)};`;
	}

	if (hidden) {
		result += 'H:true;';
	}

	return result + ';';
}
