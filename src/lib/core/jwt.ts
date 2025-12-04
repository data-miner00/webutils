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

	const encoder = new TextEncoder();
	const keyData = encoder.encode(secret);

	const cryptoKey = await crypto.subtle.importKey(
		'raw',
		keyData,
		{ name: 'HMAC', hash: 'SHA-256' },
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
