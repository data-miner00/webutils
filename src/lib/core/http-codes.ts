import codes from './http-codes.json';

export type HttpCode = {
	value: number;
	description: string;
};

export const httpCodes: HttpCode[] = codes;
