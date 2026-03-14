import type { Entity } from './types';

export type LocalhostFormat = 'localhost' | 'loopback' | 'ipv6';

export const localhostFormatDisplay = new Map([
	['localhost', 'Localhost'],
	['loopback', 'Loopback address'],
	['ipv6', 'IPv6']
]);

export type OnlineStatus = 'online' | 'offline' | 'unknown';

export type LocalhostAssociation = {
	name: string;
	description: string;
	port: number;
	format: LocalhostFormat;
	isHttps: boolean;
} & Entity;

export const LOCALHOST_STORE_NAME = 'localhost';
