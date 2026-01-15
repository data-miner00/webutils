import type { Entity } from './types';

export type Note = {
	title: string;
	content: string;
	createdAt: string;
} & Entity;

export const STORE_NAME = 'notes';

export const defaultNotes: Note[] = [
	{
		id: crypto.randomUUID(),
		title: 'Welcome Note',
		content:
			'# Welcome to the Notes Manager!\n\nThis is your first note. You can edit or delete it, and create new notes using the "Create Note" button above.\n\nHappy note-taking!',
		createdAt: new Date().toISOString()
	},
	{
		id: crypto.randomUUID(),
		title: 'Untitled Note',
		content: 'Hello world!',
		createdAt: new Date().toISOString()
	}
];
