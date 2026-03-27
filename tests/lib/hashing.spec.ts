import { base64Encode, hex, md5, sha1, sha256, sha384, sha512 } from '$lib/core/hashing';

describe('Hashing Functions', () => {
	const testString = 'Hello, World!';
	it('should correctly compute MD5 hash', () => {
		const result = md5(testString);
		expect(result).toBe('65a8e27d8879283831b664bd8b7f0ad4');
	});

	it('should correctly compute SHA-1 hash', () => {
		const result = sha1(testString);
		expect(result).toBe('0a0a9f2a6772942557ab5355d76af442f8f65e01');
	});

	it('should correctly compute SHA-256 hash', () => {
		const result = sha256(testString);
		expect(result).toBe('dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f');
	});

	it('should correctly compute SHA-384 hash', () => {
		const result = sha384(testString);
		expect(result).toBe(
			'5485cc9b3365b4305dfb4e8337e0a598a574f8242bf17289e0dd6c20a3cd44a089de16ab4ab308f63e44b1170eb5f515'
		);
	});

	it('should correctly compute SHA-512 hash', () => {
		const result = sha512(testString);
		expect(result).toBe(
			'374d794a95cdcfd8b35993185fef9ba368f160d8daf432d08ba9f1ed1e5abe6cc69291e0fa2fe0006a52570ef18c19def4e617c33ce52ef0a6e5fbe318cb0387'
		);
	});

	it('should correctly encode to Base64', () => {
		const result = base64Encode(testString);
		expect(result).toBe('SGVsbG8sIFdvcmxkIQ==');
	});

	it('should correctly convert to Hex', () => {
		const result = hex(testString);
		expect(result).toBe('48656c6c6f2c20576f726c6421');
	});
});
