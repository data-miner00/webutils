<script lang="ts">
	import { X } from '@lucide/svelte';

	import ReferencesSheet from '$lib/components/custom/references/references-sheet.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import { clickToCopy } from '$lib/core/copy-to-clipboard';
	import { emojis } from '$lib/core/emoji';

	let searchTerm = $state('');
	let selectedCategory = $state('All');

	let filteredEmojis = $derived(
		filterByCategory(selectedCategory).filter(
			(e) =>
				e.emoji.includes(searchTerm) ||
				e.category.includes(searchTerm) ||
				e.metadata.includes(searchTerm)
		)
	);

	let categories = $derived(
		Array.from(new Set(emojis.map((emoji) => emoji.category))).filter((cat) => cat)
	);

	function filterByCategory(category: string) {
		if (category === 'All') {
			return emojis;
		}
		return emojis.filter((emoji) => emoji.category === category);
	}

	// Todo: implement history mechanism
</script>

<div class="mb-4 flex gap-2">
	<InputGroup.Root class="flex-1">
		<InputGroup.Input
			placeholder="Search emojis..."
			name="search"
			required
			bind:value={searchTerm}
		/>

		{#if searchTerm}
			<InputGroup.Addon align="inline-end">
				<InputGroup.Button variant="ghost" onclick={() => (searchTerm = '')}
					><X /></InputGroup.Button
				>
			</InputGroup.Addon>
		{/if}
	</InputGroup.Root>

	<ReferencesSheet
		references={[
			{
				title: 'Emojibase',
				url: 'https://emojibase.dev/'
			},
			{
				title: 'Emojipedia',
				url: 'https://emojipedia.org/'
			}
		]}
	/>
</div>

<div
	class="mb-6 flex w-full items-center gap-2 overflow-x-scroll [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
>
	<Button
		size="sm"
		variant={selectedCategory === 'All' ? 'default' : 'secondary'}
		onclick={() => (selectedCategory = 'All')}
		class="cursor-pointer">All</Button
	>

	{#each categories as category}
		<Button
			size="sm"
			variant={selectedCategory === category ? 'default' : 'secondary'}
			onclick={() => (selectedCategory = category)}
			class="cursor-pointer">{category}</Button
		>
	{/each}
</div>

<div class="grid grid-cols-8 gap-2 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16">
	{#each filteredEmojis as emoji}
		<button
			class="flex cursor-pointer items-center justify-center rounded-lg bg-gray-100 p-2 hover:bg-gray-200"
			{@attach (node) => clickToCopy(node)}
			title={emoji.metadata}
		>
			{emoji.emoji}
		</button>
	{/each}
</div>
