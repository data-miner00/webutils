<script lang="ts">
	import References from '$lib/components/custom/references/references.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { clickToCopy } from '$lib/core/copy-to-clipboard';
	import { unicodes } from '$lib/core/unicode';

	let searchTerm = $state('');

	let filteredUnicode = $derived(
		unicodes.filter(
			(u) =>
				u.char.includes(searchTerm) ||
				u.code.includes(searchTerm) ||
				u.altCode.includes(searchTerm) ||
				u.description.toLowerCase().includes(searchTerm.toLowerCase())
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
			title={unicode.description}
		>
			{unicode.char}
		</button>
	{/each}
</div>

<References
	references={[
		{
			title: 'Unicode table',
			url: 'https://gist.github.com/ivandrofly/0fe20773bd712b303f78'
		},
		{
			title: 'Unicode Official Site',
			url: 'https://home.unicode.org/'
		},
		{
			title: 'SYMBL',
			url: 'https://symbl.cc'
		},
		{
			title: 'HTML UTF-8 Characters',
			url: 'https://www.w3schools.com/charsets/default.asp'
		}
	]}
/>
