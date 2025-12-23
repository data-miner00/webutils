<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as InputGroup from '$lib/components/ui/input-group';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { type SearchEngine, searchEngines } from '$lib/core/search-engine';
	import { SearchIcon } from '@lucide/svelte';

	let query = $state('');
	let currentSearchEngine2 = $state<string>('google');
	let currentSearchEngine = $derived<SearchEngine>(
		searchEngines.find((engine) => engine.id === currentSearchEngine2) || searchEngines[0]
	);
	let searchUrl = $derived<string>(
		query.startsWith('http://') || query.startsWith('https://')
			? query.trim()
			: `${currentSearchEngine.searchUrl}${encodeURIComponent(query.trim())}`
	);

	function performSearch(e: KeyboardEvent) {
		if (e.key !== 'Enter') return;
		window.open(searchUrl, '_blank');
		query = '';
	}
</script>

<div class="flex items-center">
	<InputGroup.Root>
		<InputGroup.Input
			id="search-input"
			autofocus
			placeholder="Search the internet or type a URL..."
			bind:value={query}
			onkeydown={performSearch}
		/>
		<InputGroup.Addon>
			<SearchIcon />
		</InputGroup.Addon>
		<InputGroup.Addon align="inline-end">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<InputGroup.Button {...props} class="!pe-1.5 text-xs">
							{currentSearchEngine.name}
							<ChevronDownIcon class="size-3" />
						</InputGroup.Button>
					{/snippet}
				</DropdownMenu.Trigger>

				<DropdownMenu.Content align="end" class="[--radius:0.95rem]">
					<DropdownMenu.Group>
						<DropdownMenu.Label>Search Engine</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.RadioGroup bind:value={currentSearchEngine2}>
							{#each searchEngines as engine}
								<DropdownMenu.RadioItem value={engine.id}>
									{engine.name}
								</DropdownMenu.RadioItem>
							{/each}
						</DropdownMenu.RadioGroup>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</InputGroup.Addon>
	</InputGroup.Root>
</div>
