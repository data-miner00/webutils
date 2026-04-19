<script lang="ts">
	import { SearchIcon } from '@lucide/svelte';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';

	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as InputGroup from '$lib/components/ui/input-group';
	import { type SearchEngine, searchEngines } from '$lib/core/search-engine';

	type Props = {
		isDialogOpen: boolean;
	};

	let { isDialogOpen = $bindable(false) }: Props = $props();

	let query = $state('');
	let currentSearchEngine2 = $state<string>(localStorage.getItem('searchEngine') || 'google');
	let currentSearchEngine = $derived<SearchEngine>(
		searchEngines.find((engine) => engine.id === currentSearchEngine2) || searchEngines[0]
	);
	let searchUrl = $derived<string>(
		query.startsWith('http://') || query.startsWith('https://')
			? query.trim()
			: `${currentSearchEngine.searchUrl}${encodeURIComponent(query.trim())}`
	);

	$effect(() => {
		localStorage.setItem('searchEngine', currentSearchEngine2);
		document.getElementById('search-input')?.focus();
	});

	function performSearch(e: KeyboardEvent) {
		if (e.key !== 'Enter') return;
		window.open(searchUrl, '_blank');
		query = '';
		isDialogOpen = false;
	}
</script>

<Dialog.Root bind:open={isDialogOpen}>
	<form>
		<Dialog.Content class="sm:max-w-lg">
			<Dialog.Header>
				<Dialog.Title>Search</Dialog.Title>
			</Dialog.Header>
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
		</Dialog.Content>
	</form>
</Dialog.Root>
