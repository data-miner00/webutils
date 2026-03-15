import type { Entity } from './types';

export const SECRET_STORE_NAME = 'secrets';

export type Secret = {
	name: string;
	snippet: string;
	type: string; // token, password, id
	iv: string; // initialization vector
	encryptedSecret: string;
	createdAt: string;
	updatedAt: string;
	version: number;
} & Entity;

function getMessageEncoding(data: string) {
	let enc = new TextEncoder();
	return enc.encode(data);
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bufToBase64(buf: ArrayBuffer) {
	return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function base64ToBuf(b64: string) {
	return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

export function getOrCreateSalt() {
	let stored = localStorage.getItem('vault_salt');
	if (stored) {
		return base64ToBuf(stored);
	}

	const salt = crypto.getRandomValues(new Uint8Array(16));
	localStorage.setItem('vault_salt', bufToBase64(salt.buffer));
	return salt;
}

export async function deriveKey(masterPassword: string, salt: Uint8Array<ArrayBuffer>) {
	const keyMaterial = await crypto.subtle.importKey(
		'raw',
		encoder.encode(masterPassword),
		'PBKDF2',
		false,
		['deriveKey']
	);

	return crypto.subtle.deriveKey(
		{
			name: 'PBKDF2',
			salt,
			iterations: 310000,
			hash: 'SHA-256'
		},
		keyMaterial,
		{
			name: 'AES-GCM',
			length: 256
		},
		false, // not extractable
		['encrypt', 'decrypt']
	);
}

type EncryptedSecret = {
	iv: string;
	ciphertext: string;
};

export async function encryptSecret(key: CryptoKey, secretText: string): Promise<EncryptedSecret> {
	const iv = crypto.getRandomValues(new Uint8Array(12));

	const ciphertext = await crypto.subtle.encrypt(
		{
			name: 'AES-GCM',
			iv
		},
		key,
		encoder.encode(secretText)
	);

	return {
		iv: bufToBase64(iv.buffer),
		ciphertext: bufToBase64(ciphertext)
	};
}

export async function decryptSecret(key: CryptoKey, encrypted: EncryptedSecret) {
	const iv = base64ToBuf(encrypted.iv);
	const ciphertext = base64ToBuf(encrypted.ciphertext);

	const plaintext = await crypto.subtle.decrypt(
		{
			name: 'AES-GCM',
			iv
		},
		key,
		ciphertext
	);

	return decoder.decode(plaintext);
}

export async function unlockVault(masterPassword: string) {
	const salt = getOrCreateSalt();
	const key = await deriveKey(masterPassword, salt);
	return key;
}
