import { LOCALHOST_STORE_NAME } from './localhost';
import { SECRET_STORE_NAME } from './secrets';

export const DATABASE_NAME = 'webutils';
export const DATABASE_VERSION = 6;

export const STORE_NAMES = [
	'links',
	'notes',
	'todo_items',
	LOCALHOST_STORE_NAME,
	SECRET_STORE_NAME
];

export class Database {
	private dbName: string;
	private version: number;
	private db: IDBDatabase | null = null;

	constructor(dbName: string, version: number = 1) {
		this.dbName = dbName;
		this.version = version;
	}

	async init(stores: string[]): Promise<void> {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.dbName, this.version);
			console.debug('Initializing database:', this.dbName, 'Version:', this.version);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => {
				this.db = request.result;
				resolve();
			};

			request.onupgradeneeded = (event) => {
				const db = (event.target as IDBOpenDBRequest).result;
				stores.forEach((storeName) => {
					if (!db.objectStoreNames.contains(storeName)) {
						db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: false });
					}
				});
			};
		});
	}

	get isDbInitialized(): boolean {
		return this.db !== null;
	}

	getDb(): IDBDatabase {
		if (!this.db) throw new Error('Database not initialized');
		return this.db;
	}
}

export const db = new Database(DATABASE_NAME, DATABASE_VERSION);

export async function initializeDatabase(): Promise<void> {
	await db.init(STORE_NAMES);
}
