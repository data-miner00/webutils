<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { clickToCopy } from '$lib/core/copy-to-clipboard';

	let { title, subtitle, value = $bindable('') } = $props();
	const randomId = 'a' + crypto.randomUUID();
</script>

<article class="border border-solid border-gray-200 p-4 rounded-md bg-gray-50 flex flex-col">
	<div class="flex justify-between items-center mb-2">
		<div class=" text-lg">{title}</div>
		<Button size="sm" {@attach (node: HTMLElement) => clickToCopy(node, '#' + randomId)}
			>Copy</Button
		>
	</div>
	<div
		class="flex-1 border border-gray-300 border-solid rounded p-2 bg-white text-sm mb-2 wrap-break-word min-h-10"
		id={randomId}
	>
		{value}
	</div>
	<div class="text-xs">{subtitle}</div>
</article>
