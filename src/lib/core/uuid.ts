import { v1 as uuidv1, v3 as uuidv3, v4 as uuidv4, v5 as uuidv5 } from 'uuid';

export type UUIDVersion = '1' | '3' | '4' | '5';

export type Options = {
	quantity: number;
	version: UUIDVersion;
	namespace?: string;
	name?: string;
};

export function generateUUID(options: Options): string[] {
	switch (options.version) {
		case '1':
			return [...Array(options.quantity)].map(() => uuidv1());

		case '3':
			return [uuidv3(options.name!, options.namespace!)];

		case '4':
			return [...Array(options.quantity)].map(() => uuidv4());

		case '5':
			return [uuidv5(options.name!, options.namespace!)];
		default:
			throw new Error('Invalid UUID version');
	}
}

export type Example = Options;

export const example: Example = {
	quantity: 12,
	version: '1'
};

export const example2: Example = {
	quantity: 6,
	version: '4'
};

export const example3: Example = {
	quantity: 1,
	version: '3',
	namespace: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
	name: 'example.com'
};

export const example4: Example = {
	quantity: 1,
	version: '5',
	namespace: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
	name: 'example.com'
};
