<script lang="ts">
	import { CircleAlertIcon, SearchIcon } from '@lucide/svelte';
	import { onMount } from 'svelte';

	import LinkComponent from '$lib/components/custom/link/link.svelte';
	import ToolCard from '$lib/components/custom/tool-card/tool-card.svelte';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import * as InputGroup from '$lib/components/ui/input-group';
	import { db, initializeDatabase } from '$lib/core/Database';
	import { IndexedDBRepository } from '$lib/core/IndexedDbRepository';
	import { type Link, STORE_NAME, defaultLinks } from '$lib/core/links';
	import { findToolByUrl, searchTools } from '$lib/core/tools';
	import { appState, toggleFavoriteTool } from '$lib/states.svelte';

	let links = $state<Link[]>([]);
	let query = $state('');

	let searchResults = $derived(searchTools(query));
	let favoriteTools = $derived(
		appState.favoriteTools.map((url) => findToolByUrl(url)).filter((tool) => tool !== undefined)
	);
	let recentTools = $derived(
		appState.recentTools
			.map((url) => findToolByUrl(url))
			.filter((tool) => tool !== undefined)
			.slice(0, 8)
	);

	onMount(async () => {
		if (!db.isDbInitialized) {
			await initializeDatabase();
		}

		const repository = new IndexedDBRepository<Link>(db, STORE_NAME);
		links = await repository.getAll();

		if (!links.length) {
			links = defaultLinks;
			links.forEach(async (link) => {
				const nonProxyLink = $state.snapshot(link);
				await repository.create(nonProxyLink);
			});
		}
	});
</script>

<div class="h-full px-4 py-6">
	<Alert.Root class="mb-5">
		<CircleAlertIcon />
		<Alert.Title>Alpha Release</Alert.Title>
		<Alert.Description
			>A lot of features are still in development. Please report any issues you encounter.</Alert.Description
		>
	</Alert.Root>

	<div class="mb-6 max-w-sm">
		<InputGroup.Root>
			<InputGroup.Input placeholder="Search tools..." bind:value={query} />
			<InputGroup.Addon>
				<SearchIcon />
			</InputGroup.Addon>
		</InputGroup.Root>
	</div>

	{#if query.trim()}
		<div class="mb-5">
			<h2 class="mb-4 text-xl font-bold">Results</h2>
			{#if searchResults.length}
				<div class="flex flex-wrap gap-4">
					{#each searchResults as tool (tool.url)}
						<ToolCard
							title={tool.title}
							url={tool.url}
							category={tool.category}
							isFavorite={appState.favoriteTools.includes(tool.url)}
							onToggleFavorite={() => toggleFavoriteTool(tool.url)}
						/>
					{/each}
				</div>
			{:else}
				<p class="text-muted-foreground text-sm">No tools found.</p>
			{/if}
		</div>
	{:else}
		<div class="mb-5">
			<h2 class="mb-4 text-xl font-bold">Favorites</h2>
			{#if favoriteTools.length}
				<div class="flex flex-wrap gap-4">
					{#each favoriteTools as tool (tool.url)}
						<ToolCard
							title={tool.title}
							url={tool.url}
							category={tool.category}
							isFavorite={true}
							onToggleFavorite={() => toggleFavoriteTool(tool.url)}
						/>
					{/each}
				</div>
			{:else}
				<p class="text-muted-foreground text-sm">Star a tool to pin it here.</p>
			{/if}
		</div>

		<div class="mb-5">
			<h2 class="mb-4 text-xl font-bold">Recent</h2>
			{#if recentTools.length}
				<div class="flex flex-wrap gap-4">
					{#each recentTools as tool (tool.url)}
						<ToolCard
							title={tool.title}
							url={tool.url}
							category={tool.category}
							isFavorite={appState.favoriteTools.includes(tool.url)}
							onToggleFavorite={() => toggleFavoriteTool(tool.url)}
						/>
					{/each}
				</div>
			{:else}
				<p class="text-muted-foreground text-sm">Tools you visit will show up here.</p>
			{/if}
		</div>
	{/if}

	{#if appState.isHomeLinkEnabled}
		<div>
			<h2 class="mb-4 text-xl font-bold">Links</h2>
			<div class="mb-5 flex flex-wrap gap-4">
				{#each links as link, index (index)}
					<LinkComponent url={link.url} title={link.title} language={link.language} />
				{/each}
			</div>
		</div>
	{/if}
</div>
