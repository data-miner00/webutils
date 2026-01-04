<script lang="ts">
	import * as Empty from '$lib/components/ui/empty/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import FolderCodeIcon from '@lucide/svelte/icons/folder-code';
	import ArrowUpRightIcon from '@lucide/svelte/icons/arrow-up-right';
	import * as Dialog from '$lib/components/ui/dialog';
	import Input from '$lib/components/ui/input/input.svelte';
	import { onMount } from 'svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { EllipsisVertical, Trash } from '@lucide/svelte';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import { Plus, SearchIcon } from '@lucide/svelte';

	let isDialogOpen = $state(false);

	// Migrate to use indexDB
	type Note = {
		id: string;
		title: string;
		content: string;
		createdAt: string;
	};

	let notes = $state<Note[]>([]);

	onMount(() => {
		const existingNotes = localStorage.getItem('notes');

		if (existingNotes) {
			notes = JSON.parse(existingNotes);
		}
	});

	let selectedNote = $derived<Note | undefined>(
		notes.find((note, index) => index === currentIndex)
	);

	let currentIndex = $state(0);

	function addNewNote() {
		const newNote: Note = {
			id: crypto.randomUUID(),
			title: 'Untitled Note',
			content: '',
			createdAt: new Date().toISOString()
		};
		notes = [...notes, newNote];

		localStorage.setItem('notes', JSON.stringify(notes));
	}

	function updateNote() {
		const { id, title, content } = selectedNote!;

		notes = notes.map((note) => (note.id === id ? { ...note, title, content } : note));

		localStorage.setItem('notes', JSON.stringify(notes));

		isDialogOpen = false;
	}

	function deleteNote(id: string) {
		notes = notes.filter((note) => note.id !== id);
		localStorage.setItem('notes', JSON.stringify(notes));
	}

	let searchQuery = $state('');

	let filteredNotes = $derived(
		notes.filter((x) => x.title.toLowerCase().includes(searchQuery.toLowerCase()))
	);
</script>

<h1 class="text-2xl font-bold mb-2">My Notes</h1>

<div class="flex gap-4 items-center mb-5">
	<InputGroup.Root>
		<InputGroup.Input bind:value={searchQuery} placeholder="Search..." />
		<InputGroup.Addon>
			<SearchIcon />
		</InputGroup.Addon>
		{#if searchQuery}
			<InputGroup.Addon align="inline-end">
				<InputGroup.Button>{filteredNotes.length} results</InputGroup.Button>
			</InputGroup.Addon>
		{/if}
	</InputGroup.Root>

	<div class="flex gap-2">
		<Button onclick={addNewNote}>
			<Plus /> Create Note
		</Button>
		<Button variant="outline" size="icon">
			<EllipsisVertical />
			<!-- Clear All -->
			<!-- Export to Json -->
		</Button>
	</div>
</div>

{#if notes.length > 0}
	<div class="flex gap-4 flex-wrap">
		{#each filteredNotes as note (note.id)}
			<div class="border border-solid border-gray-200 p-2 rounded">
				<p>{note.title}</p>
				<p class="text-sm text-gray-500">{new Date(note.createdAt).toLocaleDateString()}</p>
				<button
					class="text-blue-500 underline"
					onclick={() => {
						currentIndex = notes.indexOf(note);
						isDialogOpen = true;
					}}>Edit</button
				>
				<button onclick={() => deleteNote(note.id)}>
					<Trash />
				</button>
			</div>
		{/each}
	</div>
{:else}
	<Empty.Root>
		<Empty.Header>
			<Empty.Media variant="icon">
				<FolderCodeIcon />
			</Empty.Media>
			<Empty.Title>No Notes Yet</Empty.Title>
			<Empty.Description>
				You haven't created any notes yet. Get started by creating your first note.
			</Empty.Description>
		</Empty.Header>
		<Empty.Content>
			<div class="flex gap-2">
				<Button onclick={addNewNote}>Create Note</Button>
				<Button variant="outline">Import Note</Button>
			</div>
		</Empty.Content>
		<Button variant="link" class="text-muted-foreground" size="sm">
			<a href="#/">
				Learn More <ArrowUpRightIcon class="inline" />
			</a>
		</Button>
	</Empty.Root>
{/if}

{#if selectedNote}
	<Dialog.Root open={isDialogOpen} onOpenChange={(isOpen) => (isDialogOpen = isOpen)}>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>
					<Input bind:value={selectedNote.title} placeholder="Note Title" />
				</Dialog.Title>
			</Dialog.Header>

			<Textarea bind:value={selectedNote.content} placeholder="Enter content here..."></Textarea>

			<Dialog.Footer>
				<Button type="submit" onclick={updateNote}>Save changes</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
{/if}
