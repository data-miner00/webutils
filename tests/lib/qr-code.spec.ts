import { type WifiConfig, toWifiConnectionString } from '$lib/core/qr-code';

describe('toWifiConnectionString', () => {
	const base: WifiConfig = {
		ssid: 'MyNetwork',
		security: 'WPA',
		password: 'secret',
		hidden: false
	};

	it('should build a WPA connection string', () => {
		expect(toWifiConnectionString(base)).toBe('WIFI:T:WPA;S:MyNetwork;P:secret;;');
	});

	it('should build a WEP connection string', () => {
		expect(toWifiConnectionString({ ...base, security: 'WEP' })).toBe(
			'WIFI:T:WEP;S:MyNetwork;P:secret;;'
		);
	});

	it('should omit the password for open networks', () => {
		expect(toWifiConnectionString({ ...base, security: 'nopass' })).toBe(
			'WIFI:T:nopass;S:MyNetwork;;'
		);
	});

	it('should mark hidden networks', () => {
		expect(toWifiConnectionString({ ...base, hidden: true })).toBe(
			'WIFI:T:WPA;S:MyNetwork;P:secret;H:true;;'
		);
	});

	it('should escape special characters in SSID and password', () => {
		const config = { ...base, ssid: 'a;b,c', password: 'p:"q"\\r' };

		expect(toWifiConnectionString(config)).toBe('WIFI:T:WPA;S:a\\;b\\,c;P:p\\:\\"q\\"\\\\r;;');
	});

	it('should keep spaces and unicode as-is', () => {
		expect(toWifiConnectionString({ ...base, ssid: 'Café Wi-Fi 5G' })).toBe(
			'WIFI:T:WPA;S:Café Wi-Fi 5G;P:secret;;'
		);
	});
});
