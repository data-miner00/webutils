<script lang="ts">
	import { X } from '@lucide/svelte';

	import ReferencesSheet from '$lib/components/custom/references/references-sheet.svelte';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import * as Kbd from '$lib/components/ui/kbd/index.js';
	import { clickToCopy, copyText } from '$lib/core/copy-to-clipboard';
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

	function handleSearchKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && filteredUnicode.length > 0) {
			copyText(filteredUnicode[0].char);
		}
	}
</script>

<div class="px-4 py-6">
	<div class="mb-4 flex items-center justify-between">
		<h1 class="mb-4 block text-xl font-bold">Unicode</h1>

		<ReferencesSheet
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
	</div>

	<InputGroup.Root class="mb-4">
		<InputGroup.Input
			placeholder="Search unicode..."
			name="search"
			autofocus
			bind:value={searchTerm}
			onkeydown={handleSearchKeydown}
		/>

		{#if searchTerm}
			<InputGroup.Addon align="inline-end">
				<InputGroup.Button variant="ghost" onclick={() => (searchTerm = '')}
					><X /></InputGroup.Button
				>
			</InputGroup.Addon>
		{/if}

		<InputGroup.Addon align="block-end" class="border-t">
			Press <Kbd.Kbd>Enter</Kbd.Kbd> to copy the first result
		</InputGroup.Addon>
	</InputGroup.Root>

	<div class="grid grid-cols-8 gap-2 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16">
		{#each filteredUnicode as unicode}
			<button
				class="dark:hover:bg-sidebar-primary flex cursor-pointer items-center justify-center rounded-lg bg-gray-100 p-2 hover:bg-gray-200 dark:bg-gray-900"
				{@attach (node) => clickToCopy(node)}
				title={unicode.description}
			>
				{unicode.char}
			</button>
		{/each}
	</div>
</div>
