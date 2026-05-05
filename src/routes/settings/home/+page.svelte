<script lang="ts">
	import * as Label from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { searchEngines } from '$lib/core/search-engine';

	let isEnableBetaFeatures = $state(localStorage.getItem('betaFeaturesEnabled') === 'true');

	$effect(() => {
		localStorage.setItem('searchEngine', value);
	});

	let value = $state('');
</script>

<h1 class="text-2xl font-bold">Home Page</h1>

<p>Customize your home page on the widgets that are supported.</p>

<section class="mt-6 max-w-sm">
	<h2 class="mb-1 text-lg font-semibold">Links</h2>
	<p class="text-muted-foreground mb-4 max-w-sm text-sm">
		Configurations for displaying self-managed links at the home page.
	</p>

	<div class="flex items-center gap-3">
		<Switch id="beta-features" bind:checked={isEnableBetaFeatures} />
		<Label.Root for="beta-features">Enable Links</Label.Root>
	</div>

	<Separator class="my-6 max-w-sm" />

	<h2 class="mb-1 text-lg font-semibold">Web Search</h2>
	<p class="text-muted-foreground mb-4 max-w-sm text-sm">
		Search bar settings that allows to browser the internet from different providers.
	</p>

	<div class="mb-8 flex items-center gap-3">
		<Switch id="beta-features" bind:checked={isEnableBetaFeatures} />
		<Label.Root for="beta-features">Enable Web Search</Label.Root>
	</div>

	<Label.Root for="searchEngine" class="text-foreground mb-3">Default search engine</Label.Root>
	<Select.Root type="single" name="searchEngine" bind:value>
		<Select.Trigger class="w-full">
			{value || 'Select an engine'}
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
</section>
