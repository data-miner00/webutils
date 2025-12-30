<script lang="ts">
	import { defaultLinks, type Link, getAllLinks, addLink } from '$lib/core/links';
	import { onMount } from 'svelte';
	import LinkComponent from '$lib/components/custom/link/link.svelte';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import { Plus, SearchIcon } from '@lucide/svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	let links = $state<Link[]>([]);
	let searchQuery = $state('');

	let inputLink = $state<Link>({
		title: '',
		category: '',
		url: '',
		createdAt: new Date().toISOString()
	});

	let isDialogOpen = $state(false);

	onMount(async () => {
		links = await getAllLinks();

		if (!links.length) {
			links = defaultLinks;
			links.forEach(async (link) => {
				const nonProxyLink = $state.snapshot(link);
				await addLink(nonProxyLink);
			});
		}
	});

	async function addLinkToDb() {
		inputLink.createdAt = new Date().toISOString();

		const link = $state.snapshot(inputLink);
		await addLink(link);

		links.push(link);

		isDialogOpen = false;
		inputLink.title = '';
		inputLink.category = '';
		inputLink.url = '';
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
				Add Link
			</Dialog.Trigger>
			<Dialog.Content class="sm:max-w-[425px]">
				<Dialog.Header>
					<Dialog.Title>Add New Link</Dialog.Title>
					<Dialog.Description>
						Fill in the details for the new link. Click save when you&apos;re done.
					</Dialog.Description>
				</Dialog.Header>
				<div class="grid gap-4">
					<div class="grid gap-3">
						<Label for="title">Title</Label>
						<Input
							id="title"
							name="title"
							placeholder="e.g. Google Search"
							bind:value={inputLink.title}
						/>
					</div>
					<div class="grid gap-3">
						<Label for="category">Category</Label>
						<Input
							id="category"
							name="category"
							placeholder="e.g. Tools"
							bind:value={inputLink.category}
						/>
					</div>
					<div class="grid gap-3">
						<Label for="url">Url</Label>
						<Input
							id="url"
							name="url"
							placeholder="e.g. https://google.com"
							bind:value={inputLink.url}
						/>
					</div>
				</div>
				<Dialog.Footer>
					<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
					<Button type="submit" onclick={addLinkToDb}>Save</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</form>
	</Dialog.Root>
</div>

<div class="flex gap-4 flex-wrap">
	{#each links as link}
		<LinkComponent url={link.url} title={link.title} language={link.language} />
	{/each}
</div>
