export type JwtData = {
	header: { [key: string]: any };
	payload: { [key: string]: any };
	signature: string;
};

export type SuccessResponse = {
	success: true;
	data: JwtData;
	verified?: boolean;
};

export type ErrorResponse = {
	success: false;
	message: string;
};

export type Response = SuccessResponse | ErrorResponse;

export function isSuccess(r: Response): r is SuccessResponse {
	return r.success === true;
}

export async function decodeJwt(token: string, secret?: string): Promise<Response> {
	try {
		if (!token) {
			return {
				success: false,
				message: 'No token provided.'
			};
		}

		const parts = token.split('.');
		if (parts.length !== 3) {
			return {
				success: false,
				message: 'Invalid JWT format.'
			};
		}

		const base64UrlHeader = parts[0];
		const base64UrlPayload = parts[1];

		// Replace Base64Url characters with standard Base64 characters
		const base64Header = base64UrlHeader.replace(/-/g, '+').replace(/_/g, '/');
		const base64Payload = base64UrlPayload.replace(/-/g, '+').replace(/_/g, '/');

		// Decode and parse JSON
		const decodedHeader = JSON.parse(atob(base64Header));
		const decodedPayload = JSON.parse(atob(base64Payload));

		if (!secret) {
			return {
				success: true,
				data: {
					header: decodedHeader,
					payload: decodedPayload,
					signature: parts[2]
				}
			};
		}

		const algorithm = decodedHeader.alg;
		const encoder = new TextEncoder();
		const keyData = encoder.encode(secret);

		const cryptoKey = await crypto.subtle.importKey(
			'raw',
			keyData,
			{
				name: 'HMAC',
				hash: algorithm === 'HS256' ? 'SHA-256' : algorithm === 'HS384' ? 'SHA-384' : 'SHA-512'
			},
			false,
			['sign']
		);

		const data = encoder.encode(`${base64Header}.${base64Payload}`);
		const newSignature = await crypto.subtle.sign('HMAC', cryptoKey, data);
		const newSignatureB64 = btoa(String.fromCharCode(...new Uint8Array(newSignature)))
			.replace(/\+/g, '-')
			.replace(/\//g, '_')
			.replace(/=+$/, '');

		return {
			success: true,
			data: {
				header: decodedHeader,
				payload: decodedPayload,
				signature: parts[2]
			},
			verified: newSignatureB64 === parts[2]
		};
	} catch (error) {
		return {
			success: false,
			message: (error as Error).message
		};
	}
}

export function encodeJwt(
	header: { [key: string]: any },
	payload: { [key: string]: any },
	signature: string
): string {
	const base64UrlEncode = (obj: { [key: string]: any }) => {
		const json = JSON.stringify(obj);
		const base64 = btoa(json);
		return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
	};

	const encodedHeader = base64UrlEncode(header);
	const encodedPayload = base64UrlEncode(payload);
	return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export type DecodeJwtExample = {
	jwtToken: string;
	secret?: string;
};

export const exampleDecodeJwt: DecodeJwtExample = {
	jwtToken:
		'eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.owv7q9nVbW5tqUezF_G2nHTra-ANW3HqW9epyVwh08Y-Z-FKsnG8eBIpC4GTfTVU',
	secret: 'a-valid-string-secret-that-is-at-least-384-bits-long'
};

export const exampleDecodeJwt2: DecodeJwtExample = {
	jwtToken:
		'eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.owv7q9nVbW5tqUezF_G2nHTra-ANW3HqW9epyVwh08Y-Z-FKsnG8eBIpC4GTfTVU'
};

export const exampleDecodeJwt3: DecodeJwtExample = {
	jwtToken:
		'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.ANCf_8p1AE4ZQs7QuqGAyyfTEgYrKSjKWkhBk5cIn1_2QVr2jEjmM-1tu7EgnyOf_fAsvdFXva8Sv05iTGzETg',
	secret: 'a-valid-string-secret-that-is-at-least-512-bits-long-which-is-very-long'
};
