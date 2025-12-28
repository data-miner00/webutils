<script lang="ts">
	import { getAllLinks } from '$lib/core/database';
	import { defaultLinks, type Link } from '$lib/core/links';
	import { onMount } from 'svelte';
	import LinkComponent from '$lib/components/custom/link/link.svelte';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import { Plus, SearchIcon } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	let links = $state<Link[]>([]);
	let searchQuery = $state('');

	onMount(async () => {
		links = await getAllLinks();

		if (!links.length) {
			links = defaultLinks;
		}
	});
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

	<Button>
		<Plus />
		Add Link
	</Button>
</div>

<div class="flex gap-4 flex-wrap">
	{#each links as link}
		<LinkComponent url={link.url} title={link.title} language={link.language} />
	{/each}
</div>
