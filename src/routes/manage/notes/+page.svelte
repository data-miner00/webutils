<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { onMount } from 'svelte';
	import { EllipsisVertical, FileText } from '@lucide/svelte';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import { Plus, SearchIcon } from '@lucide/svelte';
	import CodeEditor from '$lib/components/custom/code-editor/code-editor.svelte';
	import { type Note, notesRepository } from '$lib/core/notes';

	let notes = $state<Note[]>([]);
	let currentId = $state<string | null>(null);

	onMount(async () => {
		if (!notes || notes.length === 0) {
			const defaultNote: Note = {
				id: crypto.randomUUID(),
				title: 'Welcome Note',
				content:
					'# Welcome to the Notes Manager!\n\nThis is your first note. You can edit or delete it, and create new notes using the "Create Note" button above.\n\nHappy note-taking!',
				createdAt: new Date().toISOString()
			};

			const secondNote: Note = {
				id: crypto.randomUUID(),
				title: 'Untitled Note',
				content: 'Hello world!',
				createdAt: new Date().toISOString()
			};
			notes = [defaultNote, secondNote];
			currentId = defaultNote.id;

			return;
		}
	});

	let selectedNote = $derived<Note | undefined>(notes.find((note) => note.id === currentId));

	let searchQuery = $state('');

	let filteredNotes = $derived(
		notes
			.filter((x) => x.title.toLowerCase().includes(searchQuery.toLowerCase()))
			.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
	);
</script>

<div class="mb-4">
	<div class="border border-solid border-gray-300 flex items-center border-b-0 bg-gray-50">
		{#each notes as note}
			<button
				class={`w-[150px] px-3 py-2 flex gap-2 items-center border-l border-gray-300 border-solid first-of-type:border-l-0 text-sm relative ${currentId === note.id ? 'border-t-black border-t-2 bg-white after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-1 after:bg-white' : 'bg-gray-50'}`}
				onclick={() => (currentId = note.id)}
			>
				<FileText size="16" />
				<div class="truncate">{note.title}</div>
			</button>
		{/each}
	</div>
	<CodeEditor language="text" value={selectedNote?.content || ''} class="h-full" />
</div>
