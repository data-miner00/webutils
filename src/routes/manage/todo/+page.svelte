<script lang="ts">
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Plus, SearchIcon } from '@lucide/svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { TODO_STORE_NAME, type TodoItem } from '$lib/core/todo';

	import { db, initializeDatabase } from '$lib/core/Database';
	import { onMount } from 'svelte';
	import { IndexedDBRepository } from '$lib/core/IndexedDbRepository';

	let todos = $state<TodoItem[]>([]);
	let inputTodo = $state<TodoItem>({
		id: crypto.randomUUID(),
		title: '',
		createdAt: new Date().toISOString(),
		isDone: false
	});

	let searchQuery = $state('');
	let isDialogOpen = $state(false);

	const repository = new IndexedDBRepository<TodoItem>(db, TODO_STORE_NAME);

	onMount(async () => {
		if (!db.isDbInitialized) {
			await initializeDatabase();
		}

		todos = await repository.getAll();
	});

	async function addTodoToDb() {
		const todo = $state.snapshot(inputTodo);
		await repository.create(todo);

		todos.push(todo);

		isDialogOpen = false;
	}
</script>

<div class="flex gap-4 items-center mb-5">
	<InputGroup.Root>
		<InputGroup.Input bind:value={searchQuery} placeholder="Search..." />
		<InputGroup.Addon>
			<SearchIcon />
		</InputGroup.Addon>
		<InputGroup.Addon align="inline-end">
			<InputGroup.Button>Search</InputGroup.Button>
		</InputGroup.Addon>
	</InputGroup.Root>

	<Dialog.Root bind:open={isDialogOpen}>
		<form>
			<Dialog.Trigger class={buttonVariants({ variant: 'default' })}>
				<Plus />
				Add Todo
			</Dialog.Trigger>
			<Dialog.Content class="sm:max-w-[425px]">
				<Dialog.Header>
					<Dialog.Title>Add New Todo</Dialog.Title>
					<Dialog.Description>
						Fill in the details for the new todo. Click save when you&apos;re done.
					</Dialog.Description>
				</Dialog.Header>
				<div class="grid gap-4">
					<div class="grid gap-3">
						<Label for="title">Title</Label>
						<Input
							id="title"
							name="title"
							placeholder="e.g. Google Search"
							bind:value={inputTodo.title}
						/>
					</div>
					<div class="grid gap-3">
						<Label for="description">Description</Label>
						<Input
							id="description"
							name="description"
							placeholder="e.g. hello world"
							bind:value={inputTodo.description}
						/>
					</div>
				</div>
				<Dialog.Footer>
					<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
					<Button type="submit" onclick={addTodoToDb}>Save</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</form>
	</Dialog.Root>
</div>

{#each todos as todo (todo.id)}
	<div class="p-4 border rounded-md mb-2 flex justify-between items-center">
		<div>
			<h3 class="font-bold text-lg">{todo.title}</h3>
			{#if todo.description}
				<p class="text-sm text-muted-foreground">{todo.description}</p>
			{/if}
		</div>
		<div>
			{#if todo.isDone}
				<span class="text-green-500 font-bold">Done</span>
			{:else}
				<span class="text-yellow-500 font-bold">Pending</span>
			{/if}
		</div>
	</div>
{/each}
