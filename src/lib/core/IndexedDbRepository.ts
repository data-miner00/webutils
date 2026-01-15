import { Database } from './Database';
import type { Entity, IRepository } from './types';

export class IndexedDBRepository<T extends Entity> implements IRepository<T> {
	constructor(
		private db: Database,
		private storeName: string
	) {}

	getAll(count?: number): Promise<T[]> {
		return new Promise((resolve, reject) => {
			const transaction = this.db.getDb().transaction(this.storeName, 'readonly');
			const store = transaction.objectStore(this.storeName);
			const request = store.getAll(null, count);

			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}

	getById(id: string): Promise<T | undefined> {
		return new Promise((resolve, reject) => {
			const transaction = this.db.getDb().transaction(this.storeName, 'readonly');
			const store = transaction.objectStore(this.storeName);
			const request = store.get(id);

			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}

	create(item: Omit<T, 'id'>): Promise<T> {
		const newItem = { ...item, id: crypto.randomUUID() } as T;

		return new Promise((resolve, reject) => {
			const transaction = this.db.getDb().transaction(this.storeName, 'readwrite');
			const store = transaction.objectStore(this.storeName);
			const request = store.add(newItem);

			request.onsuccess = () => resolve(newItem);
			request.onerror = () => reject(request.error);
		});
	}

	async update(id: string, item: Partial<T>): Promise<T> {
		const existing = await this.getById(id);
		if (!existing) throw new Error(`Item with id ${id} not found`);

		const updated = { ...existing, ...item, id } as T;

		return new Promise((resolve, reject) => {
			const transaction = this.db.getDb().transaction(this.storeName, 'readwrite');
			const store = transaction.objectStore(this.storeName);
			const request = store.put(updated);

			request.onsuccess = () => resolve(updated);
			request.onerror = () => reject(request.error);
		});
	}

	delete(id: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const transaction = this.db.getDb().transaction(this.storeName, 'readwrite');
			const store = transaction.objectStore(this.storeName);
			const request = store.delete(id);

			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}
}
