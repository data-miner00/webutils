import { type Response, decodeJwt, isSuccess } from './jwt';

describe('decodeJwt', () => {
	it('should return error for empty token', () => {
		const result = decodeJwt('');
		expect(result.success).toBe(false);
		expect(result.message).toBe('No token provided.');
	});

	it('should return error for invalid JWT format', () => {
		const result = decodeJwt('invalid.token');
		expect(result.success).toBe(false);
		expect(result.message).toBe('Invalid JWT format.');
	});

	it('should decode a valid JWT token', () => {
		const token =
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30';
		const result = decodeJwt(token);

		if (isSuccess(result)) {
			expect(result.success).toBe(true);
			expect(result.data).toBeDefined();
			expect(result.data.header).toEqual({ alg: 'HS256', typ: 'JWT' });
			expect(result.data.payload).toEqual({
				sub: '1234567890',
				name: 'John Doe',
				admin: true,
				iat: 1516239022
			});
			expect(result.data.signature).toBe('KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30');
		} else {
			// This should not happen for a valid token
			throw new Error('Expected a successful JWT decode');
		}
	});
});
