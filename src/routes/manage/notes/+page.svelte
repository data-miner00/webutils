<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { onMount } from 'svelte';
	import { FileText } from '@lucide/svelte';
	import { Plus } from '@lucide/svelte';
	import CodeEditor from '$lib/components/custom/code-editor/code-editor.svelte';
	import { type Note, STORE_NAME, defaultNotes } from '$lib/core/notes';
	import { db, initializeDatabase } from '$lib/core/Database';
	import { IndexedDBRepository } from '$lib/core/IndexedDbRepository';
	import * as NativeSelect from '$lib/components/ui/native-select/index.js';

	let notes = $state<Note[]>([]);
	let currentId = $state<string | null>(null);
	let content = $state<string>('');
	let currentLanguage = $state('text');

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
		currentLanguage = notes[0].language;
	});

	function createNewNote() {
		const newNote: Note = {
			id: crypto.randomUUID(),
			title: 'Untitled Note',
			content: '',
			language: 'text',
			isOpen: true,
			createdAt: new Date().toISOString()
		};
		notes = [...notes, newNote];
		currentId = newNote.id;
		repository.create(newNote);
	}

	function selectNote(id: string) {
		currentId = id;
		const foundNote = notes.find((note) => note.id === currentId);
		content = foundNote?.content || '';
		currentLanguage = foundNote?.language || 'text';
	}

	function selectLanguage(language: string) {
		if (currentId != null) {
			const noteIndex = notes.findIndex((note) => note.id === currentId);
			if (noteIndex !== -1) {
				console.log('updated language');
				notes[noteIndex].content = content;
				repository.update(currentId, { ...notes[noteIndex], language });
			}
		}
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

	type SupportedLanguage = {
		title: string;
		value: string;
	};

	const supportedLanguages: SupportedLanguage[] = [
		{
			title: 'Text',
			value: 'text'
		},
		{
			title: 'CSS',
			value: 'css'
		},
		{
			title: 'HTML',
			value: 'html'
		},
		{
			title: 'JavaScript',
			value: 'js'
		}
	];
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
		<NativeSelect.Root bind:value={currentLanguage}>
			{#each supportedLanguages as option}
				<NativeSelect.Option value={option.value} onclick={() => selectLanguage(option.value)}
					>{option.title}</NativeSelect.Option
				>
			{/each}
		</NativeSelect.Root>
	</div>
	<CodeEditor bind:language={currentLanguage} bind:value={content} class="h-full" />
</div>
