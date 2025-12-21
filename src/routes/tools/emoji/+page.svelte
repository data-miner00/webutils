<script lang="ts">
	import { emojis } from '$lib/core/emoji';
	import Input from '$lib/components/ui/input/input.svelte';
	import { clickToCopy } from '$lib/core/copy-to-clipboard';

	let searchTerm = $state('');

	let filteredEmojis = $derived(
		emojis.filter(
			(e) =>
				e.emoji.includes(searchTerm) ||
				e.category.includes(searchTerm) ||
				e.metadata.includes(searchTerm)
		)
	);
</script>

<h1 class="text-3xl font-bold mb-4">Emoji List</h1>

<Input placeholder="Search emojis..." bind:value={searchTerm} class="mb-4 w-full" />

<div class="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 gap-2">
	{#each filteredEmojis as emoji}
		<button
			class="flex justify-center items-center p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
			{@attach (node) => clickToCopy(node)}
			title={emoji.metadata}
		>
			{emoji.emoji}
		</button>
	{/each}
</div>

<a href="https://emojibase.dev/" target="_blank">Emojibase</a>
