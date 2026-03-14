<script lang="ts">
	import { ArrowUpRightIcon, Copy, Lock, Pencil, Plus, SearchIcon, Trash2 } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Empty from '$lib/components/ui/empty/index.js';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { db, initializeDatabase } from '$lib/core/Database';
	import { IndexedDBRepository } from '$lib/core/IndexedDbRepository';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import { SECRET_STORE_NAME, type Secret } from '$lib/core/secrets';

	const repository = new IndexedDBRepository<Secret>(db, SECRET_STORE_NAME);

	let isDialogOpen = $state(false);
	let secrets = $state<Secret[]>([]);
	let searchQuery = $state('');
	let isEditMode = $state(false);

	let inputSecret = $state<Secret>({
		id: crypto.randomUUID(),
		snippet: '',
		name: '',
		type: '',
		encryptedSecret: '',
		version: 1,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	});

	onMount(async () => {
		if (!db.isDbInitialized) {
			await initializeDatabase();
		}

		secrets = await repository.getAll();
	});

	async function addToDb() {
		const now = new Date().toISOString();
		const input = $state.snapshot(inputSecret);
		input.id = crypto.randomUUID();
		input.createdAt = now;
		input.updatedAt = now;
		input.snippet = input.encryptedSecret.slice(0, 3) + '*******';
		await repository.create(input);

		secrets.push(input);
		secrets = secrets;
		isDialogOpen = false;

		toast.success('Secret added succesfully.');
	}

	async function update() {
		const input = $state.snapshot(inputSecret);

		input.updatedAt = new Date().toISOString();
		input.version++;
		input.snippet = input.encryptedSecret.slice(0, 3) + '*******';
		await repository.update(input.id, input);

		const index = secrets.findIndex((secret) => secret.id === input.id);
		secrets.splice(index, 1, input);
		secrets = secrets;

		isDialogOpen = false;

		toast.success('Secret updated successfully.');
	}

	async function remove(id: string) {
		if (confirm('Are you sure you want to delete this secret?')) {
			await repository.delete(id);

			secrets = secrets.filter((secret) => secret.id != id);

			toast.success('Secret deleted successfully.');
		}
	}

	function openEditDialog(secret: Secret) {
		isEditMode = true;
		inputSecret = { ...secret };
		isDialogOpen = true;
	}
</script>

<div class="mb-5 flex items-center gap-4">
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
			<Dialog.Trigger
				class={buttonVariants({ variant: 'default' })}
				onclick={() => (isEditMode = false)}
			>
				<Plus />
				Add Secret
			</Dialog.Trigger>
			<Dialog.Content class="sm:max-w-[425px]">
				<Dialog.Header>
					<Dialog.Title>{isEditMode ? 'Edit Secret' : 'Add New Secret'}</Dialog.Title>
					<Dialog.Description>
						{isEditMode
							? "Edit the details for the secret. Click save when you're done."
							: "Fill in the details for the new secret. Click save when you're done."}
					</Dialog.Description>
				</Dialog.Header>
				<div class="grid gap-4">
					<div class="grid gap-3">
						<Label for="name">Name</Label>
						<Input
							id="name"
							name="name"
							placeholder="e.g. Surfshark Password"
							bind:value={inputSecret.name}
						/>
					</div>
					<div class="grid gap-3">
						<Label for="type">Type</Label>
						<Input
							id="type"
							name="type"
							placeholder="e.g. password"
							bind:value={inputSecret.type}
						/>
					</div>
					<div class="grid gap-3">
						<Label for="secret">Secret</Label>
						<Input
							id="secret"
							name="secret"
							placeholder="e.g. dfs^hd$uf@298sfam"
							bind:value={inputSecret.encryptedSecret}
						/>
					</div>
				</div>
				<Dialog.Footer>
					<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
					<Button type="submit" onclick={() => (isEditMode ? update() : addToDb())}>Save</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</form>
	</Dialog.Root>
</div>

{#if secrets.length > 0}
	<div>
		<Table.Root>
			<Table.Caption>A list of your saved secrets.</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[100px]">Name</Table.Head>
					<Table.Head>Type</Table.Head>
					<Table.Head>Secret</Table.Head>
					<Table.Head>Version</Table.Head>
					<Table.Head>Created At</Table.Head>
					<Table.Head>Updated At</Table.Head>
					<Table.Head></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each secrets as secret (secret.id)}
					<Table.Row>
						<Table.Cell class="font-medium">{secret.name}</Table.Cell>
						<Table.Cell>{secret.type}</Table.Cell>
						<Table.Cell>
							{secret.snippet}
						</Table.Cell>
						<Table.Cell>
							{secret.version}
						</Table.Cell>
						<Table.Cell>
							{secret.createdAt}
						</Table.Cell>
						<Table.Cell>
							{secret.updatedAt}
						</Table.Cell>
						<Table.Cell>
							<ButtonGroup.Root>
								<Button variant="outline" onclick={() => copyText(secret.encryptedSecret)}>
									<Copy />
								</Button>

								<Button variant="outline" onclick={() => openEditDialog(secret)}>
									<Pencil />
								</Button>
								<Button variant="destructive" onclick={() => remove(secret.id)}>
									<Trash2 />
								</Button>
							</ButtonGroup.Root>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
{:else}
	<Empty.Root class="border border-solid border-gray-300">
		<Empty.Header>
			<Empty.Media variant="icon">
				<Lock />
			</Empty.Media>
			<Empty.Title>No Secrets Yet</Empty.Title>
			<Empty.Description>
				You haven't entered created any secrets yet. Get started by creating one.
			</Empty.Description>
		</Empty.Header>
		<Empty.Content>
			<div class="flex gap-2">
				<Button onclick={() => (isDialogOpen = true)}>Create Secret</Button>
				<Button variant="outline" onclick={() => {}}>Load Example 2</Button>
			</div>
		</Empty.Content>
		<Button variant="link" class="text-muted-foreground" size="sm">
			<a href="#/">
				Learn More <ArrowUpRightIcon class="inline" />
			</a>
		</Button>
	</Empty.Root>
{/if}
