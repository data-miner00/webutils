<script lang="ts">
	import { emojis } from '$lib/core/emoji';
	import { clickToCopy } from '$lib/core/copy-to-clipboard';
	import References from '$lib/components/custom/references/references.svelte';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import { X } from '@lucide/svelte';

	let searchTerm = $state('');

	let filteredEmojis = $derived(
		emojis.filter(
			(e) =>
				e.emoji.includes(searchTerm) ||
				e.category.includes(searchTerm) ||
				e.metadata.includes(searchTerm)
		)
	);

	// Todo: implement category and history mechanism
</script>

<InputGroup.Root class="mb-4">
	<InputGroup.Input placeholder="Search emojis..." name="search" required bind:value={searchTerm} />
	<InputGroup.Addon align="inline-end">
		<InputGroup.Button variant="ghost" onclick={() => (searchTerm = '')}><X /></InputGroup.Button>
	</InputGroup.Addon>
</InputGroup.Root>

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

<References
	references={[
		{
			title: 'Emojibase',
			url: 'https://emojibase.dev/'
		}
	]}
/>
