<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/custom/shared/Header.svelte';
	import { Toaster } from '$lib/components/ui/sonner';

	let { children } = $props();

	function fetchImage(id: number): string {
		return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Webutils</title>
	<meta name="description" content="A collection of web utilities built with SvelteKit." />
</svelte:head>

<Toaster position="top-center" />

<Header />

<div class="container mx-auto px-4 py-6">
	{@render children()}
</div>

<div class="fixed bottom-2 right-2">
	<img src={fetchImage(151)} alt="Showing a pokemon" onerror={(e) => e.currentTarget.remove()} />
</div>
