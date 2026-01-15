<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { onMount } from 'svelte';
	import { EllipsisVertical, FileText } from '@lucide/svelte';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import { Plus, SearchIcon } from '@lucide/svelte';
	import CodeEditor from '$lib/components/custom/code-editor/code-editor.svelte';
	import { type Note, STORE_NAME, defaultNotes } from '$lib/core/notes';
	import { db, initializeDatabase } from '$lib/core/Database';
	import { IndexedDBRepository } from '$lib/core/IndexedDbRepository';

	let notes = $state<Note[]>([]);
	let currentId = $state<string | null>(null);
	let content = $state<string>('');

	const repository = new IndexedDBRepository<Note>(db, STORE_NAME);

	onMount(async () => {
		if (!db.isDbInitialized) {
			await initializeDatabase();
		}

		notes = await repository.getAll();
		if (!notes || notes.length === 0) {
			notes = defaultNotes;
			for (const note of defaultNotes) {
				await repository.create(note);
			}
		}

		currentId = notes[0].id;
		content = notes[0].content;
	});

	let searchQuery = $state('');

	let filteredNotes = $derived(
		notes
			.filter((x) => x.title.toLowerCase().includes(searchQuery.toLowerCase()))
			.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
	);

	function createNewNote() {
		const newNote: Note = {
			id: crypto.randomUUID(),
			title: 'Untitled Note',
			content: '',
			createdAt: new Date().toISOString()
		};
		notes = [...notes, newNote];
		currentId = newNote.id;
		repository.create(newNote);
	}

	function selectNote(id: string) {
		currentId = id;
		content = notes.find((note) => note.id === currentId)?.content || '';
	}

	$effect(() => {
		if (currentId !== null) {
			const noteIndex = notes.findIndex((note) => note.id === currentId);
			if (noteIndex !== -1) {
				notes[noteIndex].content = content;
				repository.update(currentId, notes[noteIndex]);
			}
		}
	});
</script>

<div class="mb-4 h-[calc(100vh-300px)]">
	<div class="border border-solid border-gray-300 flex items-center border-b-0 bg-gray-50">
		{#each notes as note}
			<button
				class={`w-[150px] px-3 py-2 flex gap-2 items-center border-l border-gray-300 border-solid first-of-type:border-l-0 text-sm relative ${currentId === note.id ? 'border-t-black border-t-2 bg-white after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-1 after:bg-white' : 'bg-gray-50'}`}
				onclick={() => selectNote(note.id)}
			>
				<FileText size="16" />
				<div class="truncate">{note.title}</div>
			</button>
		{/each}
		<Button variant="ghost" class="mr-2 p-2" onclick={createNewNote}>
			<Plus size="16" />
		</Button>
	</div>
	<CodeEditor language="text" bind:value={content} class="h-full" />
</div>
