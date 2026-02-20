<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import { Clipboard } from '@lucide/svelte';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as NativeSelect from '$lib/components/ui/native-select/index.js';
	import References from '$lib/components/custom/references/references.svelte';

	let timestamp = $state(Math.floor(Date.now() / 1000));
	let timestampMode = $state<'second' | 'millisecond'>('second');

	onMount(() => {
		const interval = setInterval(() => {
			if (timestampMode === 'second') {
				timestamp = Math.floor(Date.now() / 1000);
			} else {
				timestamp = Date.now();
			}
		}, 1000);

		return () => clearInterval(interval);
	});

	function copyTimestamp() {
		copyText(timestamp.toString());
	}

	let input = $state('');
</script>

<div class="flex flex-col items-center justify-center h-40 gap-4">
	<h1 class="text-4xl font-bold">Current Timestamp</h1>
	<p class="text-2xl text-muted-foreground">
		{timestamp}
		<Button variant="outline" size="icon" onclick={copyTimestamp}><Clipboard /></Button>
	</p>
	<NativeSelect.Root class=" basis-1/6" bind:value={timestampMode}>
		<NativeSelect.Option value="second">Second</NativeSelect.Option>
		<NativeSelect.Option value="millisecond">Millisecond</NativeSelect.Option>
	</NativeSelect.Root>
</div>

<div class="flex flex-col items-center justify-center h-40 gap-4">
	<Input placeholder="Enter a timestamp" bind:value={input} />
	<p class="mt-2 text-sm text-muted-foreground">
		{#if input}
			{new Date(parseInt(input) * 1000).toLocaleString()}
		{/if}
	</p>
</div>

<References
	references={[
		{
			title: 'Epoch Converter',
			url: 'https://www.epochconverter.com/'
		}
	]}
/>
