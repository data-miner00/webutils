import type { Entity } from './types';

export type LocalhostFormat = 'localhost' | 'loopback' | 'ipv6';

export const localhostFormatDisplay = new Map([
	['localhost', 'Localhost'],
	['loopback', 'Loopback address'],
	['ipv6', 'IPv6']
]);

export type OnlineStatus = 'online' | 'offline';

export type LocalhostAssociation = {
	name: string;
	description: string;
	port: number;
	format: LocalhostFormat;
	isHttps: boolean;
	status?: OnlineStatus;
} & Entity;

export const LOCALHOST_STORE_NAME = 'localhost';

export function generateUrl(isHttps: boolean, format: LocalhostFormat, port: number): string {
	const LOCALHOST = 'localhost';
	const LOOPBACK = '172.0.0.1';
	const IPV6 = '[::1]';
	const protocol = isHttps ? 'https' : 'http';
	const localhost = format == 'loopback' ? LOOPBACK : format == 'ipv6' ? IPV6 : LOCALHOST;

	return `${protocol}://${localhost}:${port}`;
}
