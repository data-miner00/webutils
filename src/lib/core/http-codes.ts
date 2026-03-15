import codes from './http-codes.json';

export type HttpCode = {
	value: number;
	description: string;
	meaning: string;
	deprecated: boolean;
	rfc: string;
};

export const httpCodes: HttpCode[] = codes;
