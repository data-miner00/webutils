import type { Entity } from './types';

export type Note = {
	title: string;
	content: string;
	language: string;
	isOpen: boolean;
	createdAt: string;
} & Entity;

export const STORE_NAME = 'notes';

export const defaultNotes: Note[] = [
	{
		id: crypto.randomUUID(),
		title: 'Welcome Note',
		content:
			'# Welcome to the Notes Manager!\n\nThis is your first note. You can edit or delete it, and create new notes using the "Create Note" button above.\n\nHappy note-taking!',
		language: 'text',
		isOpen: true,
		createdAt: new Date().toISOString()
	},
	{
		id: crypto.randomUUID(),
		title: 'Untitled Note',
		content: 'Hello world!',
		language: 'text',
		isOpen: true,
		createdAt: new Date().toISOString()
	}
];
