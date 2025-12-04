<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as InputGroup from '$lib/components/ui/input-group';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import Input from '$lib/components/ui/input/input.svelte';

	type SearchEngine = {
		faviconUrl: string;
		id: string;
		name: string;
		searchUrl: string;
	};

	const searchEngines: SearchEngine[] = [
		{
			id: 'google',
			faviconUrl: 'https://www.google.com/favicon.ico',
			name: 'Google',
			searchUrl: 'https://www.google.com/search?q='
		},
		{
			id: 'bing',
			faviconUrl: 'https://www.bing.com/favicon.ico',
			name: 'Bing',
			searchUrl: 'https://www.bing.com/search?q='
		},
		{
			id: 'yahoo',
			faviconUrl: 'https://search.yahoo.com/favicon.ico',
			name: 'Yahoo',
			searchUrl: 'https://search.yahoo.com/search?p='
		}
	];

	let query = $state('');
	let currentSearchEngine2 = $state<string>('google');
	let currentSearchEngine = $derived<SearchEngine>(
		searchEngines.find((engine) => engine.id === currentSearchEngine2) || searchEngines[0]
	);
	let searchUrl = $derived<string>(
		`${currentSearchEngine.searchUrl}${encodeURIComponent(query.trim())}`
	);

	function performSearch(e: KeyboardEvent) {
		if (e.key !== 'Enter') return;
		window.open(searchUrl, '_blank');
		query = '';
	}
</script>

<div class="flex items-center">
	<Input
		placeholder="Search the internet or type a URL"
		bind:value={query}
		onkeydown={performSearch}
	/>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<InputGroup.Button {...props} variant="ghost" class="!pe-1.5 text-xs">
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
</div>
