import { type Entity } from './types';

export type TodoItem = {
	title: string;
	description?: string;
	createdAt: string;
	isDone: boolean;
} & Entity;

export const TODO_STORE_NAME = 'todo_items';
