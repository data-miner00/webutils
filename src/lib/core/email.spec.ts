import { extractEmailDomain, getEmailProviderUrlFromEmail, verifyEmailAddress } from './email';

describe('Email Provider Utils', () => {
	describe('extractEmailDomain', () => {
		it('should extract domain from valid email addresses', () => {
			const testCases = [
				{ email: 'user@gmail.com', expected: 'gmail.com' },
				{ email: 'test@outlook.com', expected: 'outlook.com' },
				{ email: 'admin@yahoo.co.uk', expected: 'yahoo.co.uk' },
				{ email: 'user.name@protonmail.com', expected: 'protonmail.com' },
				{ email: 'test+alias@icloud.com', expected: 'icloud.com' },
				{ email: 'contact@company.domain.com', expected: 'company.domain.com' }
			];

			testCases.forEach(({ email, expected }) => {
				expect(extractEmailDomain(email)).toBe(expected);
			});
		});

		it('should return null for invalid email addresses', () => {
			const invalidEmails = [
				'invalid-email',
				'@gmail.com',
				'user@',
				'user@@gmail.com',
				'user@.com',
				'',
				'user@domain',
				'user@domain.',
				'not an email'
			];

			invalidEmails.forEach((email) => {
				expect(extractEmailDomain(email)).toBeNull();
			});
		});

		it('should handle edge cases', () => {
			const edgeCases = [
				{ email: 'a@b.co', expected: 'b.co' },
				{ email: 'user_name@test-domain.com', expected: 'test-domain.com' },
				{ email: 'user.name+tag@sub.domain.org', expected: 'sub.domain.org' }
			];

			edgeCases.forEach(({ email, expected }) => {
				expect(extractEmailDomain(email)).toBe(expected);
			});
		});
	});

	describe('getEmailProviderUrlFromEmail', () => {
		it('should return correct provider URL for supported email providers', () => {
			const testCases = [
				{ email: 'user@gmail.com', expected: 'https://mail.google.com/mail/u/0/#inbox' },
				{ email: 'test@outlook.com', expected: 'https://outlook.live.com/mail/0/inbox' },
				{ email: 'admin@yahoo.com', expected: 'https://mail.yahoo.com/d/folders/1' },
				{ email: 'user@protonmail.com', expected: 'https://mail.proton.me/u/0/inbox' },
				{ email: 'contact@icloud.com', expected: 'https://www.icloud.com/mail' },
				{ email: 'person@aol.com', expected: 'https://mail.aol.com/webmail-std/en-us/suite' },
				{ email: 'business@zoho.com', expected: 'https://mail.zoho.com/zm/#mail/folder/inbox' },
				{ email: 'user@gmx.com', expected: 'https://www.gmx.com/#.1174131-header-naviloggedin1-3' },
				{ email: 'test@yandex.com', expected: 'https://mail.yandex.com/#inbox' },
				{ email: 'user@fastmail.com', expected: 'https://www.fastmail.com/mail/Inbox' },
				{ email: 'contact@tutanota.com', expected: 'https://mail.tutanota.com/mail' }
			];

			testCases.forEach(({ email, expected }) => {
				expect(getEmailProviderUrlFromEmail(email)).toBe(expected);
			});
		});

		it('should return null for unsupported email providers', () => {
			const unsupportedEmails = [
				'user@custom-domain.com',
				'admin@company.org',
				'test@unknown-provider.net',
				'contact@business.io'
			];

			unsupportedEmails.forEach((email) => {
				expect(getEmailProviderUrlFromEmail(email)).toBeNull();
			});
		});

		it('should return null for invalid email addresses', () => {
			const invalidEmails = ['invalid-email', '@gmail.com', 'user@', '', 'not an email'];

			invalidEmails.forEach((email) => {
				expect(getEmailProviderUrlFromEmail(email)).toBeNull();
			});
		});

		it('should handle emails with subdomains correctly', () => {
			const testCases = [
				{ email: 'user@mail.gmail.com', expected: null }, // 'mail' is not in the map
				{ email: 'user@subdomain.yahoo.com', expected: null } // 'subdomain' is not in the map
			];

			testCases.forEach(({ email, expected }) => {
				expect(getEmailProviderUrlFromEmail(email)).toBe(expected);
			});
		});
	});

	describe('verify email', () => {
		it('is a valid email', () => {
			const actual = verifyEmailAddress('abc@gmail.com');
			expect(actual).toBe(true);
		});

		it('is an invalid email', () => {
			const actual = verifyEmailAddress('abc^gmail.com');
			expect(actual).toBe(false);
		});
	});
});
