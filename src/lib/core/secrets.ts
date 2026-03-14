import type { Entity } from './types';

export const SECRET_STORE_NAME = 'secrets';

export type Secret = {
	name: string;
	snippet: string;
	type: string; // token, password, id
	encryptedSecret: string;
	createdAt: string;
	updatedAt: string;
	version: number;
} & Entity;
