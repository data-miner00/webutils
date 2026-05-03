<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';

	import favicon from '$lib/assets/favicon.svg';
	import AppSidebarRight from '$lib/components/custom/app-sidebar-right/app-sidebar-right.svelte';
	import AppSidebar from '$lib/components/custom/app-sidebar/app-sidebar.svelte';
	import CommandPanel from '$lib/components/custom/command-panel/command-panel.svelte';
	import SearchDialog from '$lib/components/custom/search/search-dialog.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Toaster } from '$lib/components/ui/sonner';

	import './layout.css';

	let { children } = $props();
	let isCommandOpen = $state(false);
	let isDialogOpen = $state(false);

	function fetchImage(id: number): string {
		return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
	}

	function onKeyDown(event: KeyboardEvent) {
		if (event.repeat) return;

		switch (event.key) {
			case 'k':
				if (event.ctrlKey) {
					event.preventDefault();
					isDialogOpen = true;
				}
				break;
			case 'j':
				if (event.ctrlKey) {
					event.preventDefault();
					isCommandOpen = true;
				}
			default:
				break;
		}
	}
	const showPokemon = (localStorage.getItem('settings_pokemon') || 'true') === 'true';
</script>

<svelte:window onkeydown={onKeyDown} />

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Webutils</title>
	<meta name="description" content="A collection of web utilities built with SvelteKit." />
</svelte:head>

<Toaster position="top-center" />
<CommandPanel bind:isCommandOpen />
<SearchDialog bind:isDialogOpen />
<ModeWatcher />

<Sidebar.Provider>
	<AppSidebar />

	<Sidebar.Inset class="relative flex w-full flex-col">
		<!-- <Header /> -->
		<div class="flex-1">
			{@render children()}
		</div>
	</Sidebar.Inset>
	<AppSidebarRight />
</Sidebar.Provider>

<!--

{#if showPokemon}
	<div class="pointer-events-none fixed right-2 bottom-2">
		<img src={fetchImage(151)} alt="Showing a pokemon" onerror={(e) => e.currentTarget.remove()} />
	</div>
{/if}

-->
