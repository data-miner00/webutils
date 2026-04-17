export interface Entity {
	id: string;
}

export interface IRepository<T extends Entity> {
	getAll(): Promise<T[]>;
	getById(id: string): Promise<T | undefined>;
	create(item: Omit<T, 'id'>): Promise<T>;
	update(id: string, item: Partial<T>): Promise<T>;
	delete(id: string): Promise<void>;
}

export type UserProfile = {
	username?: string;
	avatarImage?: string;
	firstName?: string;
	lastName?: string;
	websiteUrl?: string;
	bio?: string;
	email?: string;
};
