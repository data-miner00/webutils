import unicode from './unicode.json';

export const enum UnicodeEnum {
	// Control Characters
	NULL = 0x0000,
	START_OF_HEADING = 0x0001,
	START_OF_TEXT = 0x0002
}

export type Unicode = {
	char: string;
	code: string;
	altCode: string;
	description: string;
	category: string;
};

export const unicodes: Unicode[] = unicode;
