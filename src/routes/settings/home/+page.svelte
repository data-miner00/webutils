<script lang="ts">
	import { toast } from 'svelte-sonner';

	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Label from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import {
		IsLinkEnabledStorageKey,
		IsWebSearchEnabledStorageKey,
		LinkCountStorageKey,
		SearchEngineStorageKey
	} from '$lib/constants';
	import { searchEngines } from '$lib/core/search-engine';
	import {
		setHomeLinkDisplayCount,
		setIsEnableHomeLink,
		setIsEnableHomeWebSearch
	} from '$lib/states.svelte';

	let isLinkEnabled = $state(localStorage.getItem(IsLinkEnabledStorageKey) === 'true');
	let isWebSearchEnabled = $state(localStorage.getItem(IsWebSearchEnabledStorageKey) === 'true');
	let linkCount = $state(Number(localStorage.getItem(LinkCountStorageKey) || '8'));

	let searchEngineInput = $state('');

	function saveChanges() {
		localStorage.setItem(SearchEngineStorageKey, searchEngineInput);
		setIsEnableHomeLink(isLinkEnabled);
		setIsEnableHomeWebSearch(isWebSearchEnabled);
		setHomeLinkDisplayCount(linkCount);

		toast.success('Settings updated successfully');
	}
</script>

<h1 class="text-2xl font-bold">Home Page</h1>

<p>Customize your home page on the widgets that are supported.</p>

<section class="mt-6 max-w-sm">
	<h2 class="mb-1 text-lg font-semibold">Links</h2>
	<p class="text-muted-foreground mb-4 max-w-sm text-sm">
		Configurations for displaying self-managed links at the home page.
	</p>

	<div class="mb-6 flex items-center gap-3">
		<Switch id="beta-features" bind:checked={isLinkEnabled} />
		<Label.Root for="beta-features">Enable Links</Label.Root>
	</div>

	<div>
		<Label.Root class="mb-3" for="port">Display Count</Label.Root>
		<Input
			name="clipboard-count"
			placeholder="e.g. 30"
			min={0}
			max={30}
			bind:value={linkCount}
			type="number"
			class="mb-4"
		/>
	</div>

	<Separator class="my-6 max-w-sm" />

	<h2 class="mb-1 text-lg font-semibold">Web Search</h2>
	<p class="text-muted-foreground mb-4 max-w-sm text-sm">
		Search bar settings that allows to browser the internet from different providers.
	</p>

	<div class="mb-8 flex items-center gap-3">
		<Switch id="beta-features" bind:checked={isWebSearchEnabled} />
		<Label.Root for="beta-features">Enable Web Search</Label.Root>
	</div>

	<Label.Root for="searchEngine" class="text-foreground mb-3">Default search engine</Label.Root>
	<Select.Root type="single" name="searchEngine" bind:value={searchEngineInput}>
		<Select.Trigger class="w-full">
			{searchEngineInput || 'Select an engine'}
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>Search Engine</Select.Label>
				{#each searchEngines as engine (engine.id)}
					<Select.Item value={engine.id} label={engine.name}>
						{engine.name}
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>

	<Separator class="my-6 " />

	<div class="grid w-full gap-4">
		<Button size="sm" variant="outline" onclick={saveChanges}>Save Changes</Button>
	</div>
</section>
