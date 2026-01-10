<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import { clickToCopy } from '$lib/core/copy-to-clipboard';

	let searchTerm = $state('');

	let filteredUnicode = $derived(
		[
			{ char: 'A', code: 'U+0041', name: 'Latin Capital Letter A' },
			{ char: 'あ', code: 'U+3042', name: 'Hiragana Letter A' },
			{ char: '😊', code: 'U+1F60A', name: 'Smiling Face with Smiling Eyes' },
			{ char: '€', code: 'U+20AC', name: 'Euro Sign' },
			{ char: 'Ж', code: 'U+0416', name: 'Cyrillic Capital Letter Zhe' },
			{ char: 'ش', code: 'U+0634', name: 'Arabic Letter Sheen' },
			{ char: 'Δ', code: 'U+0394', name: 'Greek Capital Letter Delta' },
			{ char: '₹', code: 'U+20B9', name: 'Indian Rupee Sign' }
		].filter(
			(u) =>
				u.char.includes(searchTerm) ||
				u.code.includes(searchTerm) ||
				u.name.toLowerCase().includes(searchTerm.toLowerCase())
		)
	);
</script>

<h1 class="text-3xl font-bold mb-4">Unicode</h1>

<Input placeholder="Search unicode..." bind:value={searchTerm} class="mb-4 w-full" />

<div class="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 gap-2">
	{#each filteredUnicode as unicode}
		<button
			class="flex justify-center items-center p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
			{@attach (node) => clickToCopy(node)}
			title={unicode.name}
		>
			{unicode.char}
		</button>
	{/each}
</div>
