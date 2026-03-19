import codes from './http-codes.json';

export type HttpCode = {
	value: string;
	description: string;
	meaning: string;
	deprecated: boolean;
	rfc: string;
};

export const httpCodes: HttpCode[] = codes.map((x) => ({ ...x, value: String(x.value) }));
