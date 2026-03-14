<script lang="ts">
	import {
		AlertCircleIcon,
		ArrowDownUp,
		ArrowUpRightIcon,
		ChevronsLeftRightEllipsis,
		Copy,
		Pencil,
		Plus,
		RefreshCcw,
		SearchIcon,
		SquareArrowOutUpRight,
		Trash2
	} from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	import * as Alert from '$lib/components/ui/alert/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Empty from '$lib/components/ui/empty/index.js';
	import { Input } from '$lib/components/ui/input';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as NativeSelect from '$lib/components/ui/native-select/index.js';
	import * as Select from '$lib/components/ui/select';
	import { Spinner } from '$lib/components/ui/spinner';
	import * as Table from '$lib/components/ui/table/index.js';
	import { db, initializeDatabase } from '$lib/core/Database';
	import { IndexedDBRepository } from '$lib/core/IndexedDbRepository';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import {
		LOCALHOST_STORE_NAME,
		type LocalhostAssociation,
		type LocalhostFormat,
		type OnlineStatus,
		localhostFormatDisplay
	} from '$lib/core/localhost';

	let localhostAssociations: LocalhostAssociation[] = $state([]);
	let inputAssociation = $state<LocalhostAssociation>({
		id: crypto.randomUUID(),
		name: '',
		description: '',
		format: 'localhost',
		port: 3000,
		isHttps: false
	});
	let isEditMode = $state(false);

	let searchQuery = $state('');
	let isDialogOpen = $state(false);

	const repository = new IndexedDBRepository<LocalhostAssociation>(db, LOCALHOST_STORE_NAME);

	onMount(async () => {
		if (!db.isDbInitialized) {
			await initializeDatabase();
		}

		localhostAssociations = await repository.getAll();
	});

	async function addToDb() {
		const item = $state.snapshot(inputAssociation);
		await repository.create(item);

		localhostAssociations.push(item);

		isDialogOpen = false;

		toast.info('New association added successfully.');

		// Reset
		inputAssociation = {
			id: crypto.randomUUID(),
			name: '',
			description: '',
			format: 'localhost',
			port: 3000,
			isHttps: false
		};
	}

	function openEditDialog(association: LocalhostAssociation) {
		isEditMode = true;
		inputAssociation = { ...association };
		isDialogOpen = true;
	}

	async function update() {
		const input = $state.snapshot(inputAssociation);
		await repository.update(inputAssociation.id, input);

		const index = localhostAssociations.findIndex((x) => x.id === input.id);
		localhostAssociations.splice(index, 1, input);
		localhostAssociations = localhostAssociations;

		isDialogOpen = false;

		toast.info('Association updated successfully.');
	}

	async function remove(id: string) {
		if (confirm(`Are you sure you want to delete record with ID '${id}'?`)) {
			await repository.delete(id);
			localhostAssociations = localhostAssociations.filter((x) => x.id != id);
			toast.info('Record deleted successfully.');
		}
	}

	let port = $state(3000);
	let isHttps = $state(true);
	let format: 'localhost' | 'loopback' | 'ipv6' = $state('localhost');
	const LOCALHOST = 'localhost';
	const LOOPBACK = '172.0.0.1';
	const IPV6 = '[::1]';

	function generateUrl(isHttpsx: boolean, formatx: string, portx: number): string {
		const protocol = isHttpsx ? 'https' : 'http';
		const localhost = formatx == 'loopback' ? LOOPBACK : formatx == 'ipv6' ? IPV6 : LOCALHOST;

		return `${protocol}://${localhost}:${portx}`;
	}

	let localhostUrl = $derived(generateUrl(isHttps, format, port));
	let isPinging = $state(false);

	type PingStatus = 'unknown' | 'online' | 'offline';

	let urlStatus = $state<PingStatus>('unknown');

	$effect(() => {
		port && (urlStatus = 'unknown');
	});

	async function ping() {
		isPinging = true;
		try {
			const response = await fetch(localhostUrl, {
				method: 'head'
			});

			if (response.status === 200) {
				urlStatus = 'online';
			} else {
				urlStatus = 'offline';
			}
		} catch {
			urlStatus = 'offline';
		} finally {
			isPinging = false;
		}
	}

	function copyUrl() {
		return copyText(localhostUrl);
	}

	function openInNewTab() {
		window.open(localhostUrl, '_blank');
	}
</script>

<h2 class="mb-4 text-xl">URL Builder</h2>

<div class="mb-12">
	<div class="mb-1 font-bold">Preview</div>
	<Select.Root type="single" name="imageFormat" bind:value={format}>
		<Select.Trigger>
			{localhostUrl}
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>Format</Select.Label>
				<Select.Item value="localhost" label="localhost"
					>{generateUrl(isHttps, 'localhost', port)}</Select.Item
				>
				<Select.Item value="loopback" label="loopback"
					>{generateUrl(isHttps, 'loopback', port)}</Select.Item
				>
				<Select.Item value="ipv6" label="ipv6">{generateUrl(isHttps, 'ipv6', port)}</Select.Item>
			</Select.Group>
		</Select.Content>
	</Select.Root>

	<Label class="mb-1 text-base font-bold" for="port">Port</Label>
	<Input
		name="port"
		placeholder="e.g. 3000"
		min={1}
		max={65535}
		bind:value={port}
		type="number"
		class="mb-4"
	/>

	{#if port < 1 || port > 65536}
		<Alert.Root variant="destructive">
			<AlertCircleIcon />
			<Alert.Title>Invalid Port Number</Alert.Title>
			<Alert.Description>
				<p>The port number must be</p>
				<ul class="list-inside list-disc text-sm">
					<li>Not lower than 1</li>
					<li>Not higher than 65535</li>
				</ul>
			</Alert.Description>
		</Alert.Root>
	{/if}

	<div class="mb-1 font-bold">Options</div>
	<div class="mb-4 flex items-center gap-3">
		<Checkbox id="https" bind:checked={isHttps} />
		<Label for="https">Using HTTPS protocol</Label>
	</div>

	<div class="mb-1 font-bold">Actions</div>
	<div class="mb-2">
		<Button class="cursor-pointer" variant="outline" onclick={ping} disabled={isPinging}>
			{#if isPinging}
				<Spinner /> Pinging
			{:else}
				<ArrowDownUp /> Ping
			{/if}
		</Button>
		<Button class="cursor-pointer" variant="outline" size="icon" onclick={copyUrl}>
			<Copy />
		</Button>
		<Button class="cursor-pointer" variant="outline" size="icon" onclick={openInNewTab}>
			<SquareArrowOutUpRight />
		</Button>
		<Button class="cursor-pointer" variant="outline" size="icon" onclick={() => {}}>
			<Plus />
		</Button>
	</div>

	<div>Status: {urlStatus}</div>
</div>

<h2 class="mb-4 text-xl">Saved associations</h2>

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
				Add Association
			</Dialog.Trigger>
			<Dialog.Content class="sm:max-w-[425px]">
				<Dialog.Header>
					<Dialog.Title>{isEditMode ? 'Edit Association' : 'Add New Association'}</Dialog.Title>
					<Dialog.Description>
						{isEditMode
							? "Edit the details for the association. Click save when you're done."
							: "Fill in the details for the new association. Click save when you're done."}
					</Dialog.Description>
				</Dialog.Header>
				<div class="grid gap-4">
					<div class="grid gap-3">
						<Label for="name">Name</Label>
						<Input
							id="name"
							name="name"
							placeholder="e.g. CRM API"
							bind:value={inputAssociation.name}
						/>
					</div>
					<div class="grid gap-3">
						<Label for="description">Description</Label>
						<Input
							id="description"
							name="description"
							placeholder="e.g. This is the API for testing with CRM locally."
							bind:value={inputAssociation.description}
						/>
					</div>
					<div class="grid gap-3">
						<Label for="port">Port</Label>
						<Input
							id="port"
							name="port"
							placeholder="e.g. 3000"
							bind:value={inputAssociation.port}
							type="number"
							min={1}
							max={65535}
						/>
					</div>

					<div class="grid gap-3">
						<Label for="format">Format</Label>
						<NativeSelect.Root bind:value={inputAssociation.format}>
							{#each localhostFormatDisplay as display}
								<NativeSelect.Option value={display[0]}>{display[1]}</NativeSelect.Option>
							{/each}
						</NativeSelect.Root>
					</div>

					<div class="flex gap-3">
						<Checkbox id="association_https" bind:checked={inputAssociation.isHttps} />
						<Label for="association_https">Using HTTPS protocol</Label>
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

{#if localhostAssociations.length > 0}
	<div>
		<Table.Root>
			<Table.Caption>A list of your saved local development endpoint.</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[100px]">Name</Table.Head>
					<Table.Head>Description</Table.Head>
					<Table.Head>URL</Table.Head>
					<Table.Head>Status</Table.Head>
					<Table.Head>Actions</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each localhostAssociations as association (association.id)}
					{@const associationUrl = generateUrl(
						association.isHttps,
						association.format,
						association.port
					)}
					<Table.Row>
						<Table.Cell class="font-medium">{association.name}</Table.Cell>
						<Table.Cell>{association.description}</Table.Cell>
						<Table.Cell>
							{associationUrl}
						</Table.Cell>
						<Table.Cell>
							<span class="text-green-500">●</span> Online
						</Table.Cell>
						<Table.Cell>
							<ButtonGroup.Root>
								<Button variant="outline" onclick={() => copyText(associationUrl)}>
									<Copy />
								</Button>
								<Button variant="outline" onclick={() => window.open(associationUrl, '_blank')}>
									<SquareArrowOutUpRight />
								</Button>
								<Button variant="outline" onclick={() => {}}>
									<RefreshCcw />
								</Button>
								<Button variant="outline" onclick={() => openEditDialog(association)}>
									<Pencil />
								</Button>
								<Button variant="destructive" onclick={() => remove(association.id)}>
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
				<ChevronsLeftRightEllipsis />
			</Empty.Media>
			<Empty.Title>No Associations Yet</Empty.Title>
			<Empty.Description>
				You haven't entered created any associations yet. Get started by creating one.
			</Empty.Description>
		</Empty.Header>
		<Empty.Content>
			<div class="flex gap-2">
				<Button onclick={() => (isDialogOpen = true)}>Create Association</Button>
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
