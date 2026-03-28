<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { clickToCopy } from '$lib/core/copy-to-clipboard';

	let { title, subtitle, value } = $props();
	const randomId = 'a' + crypto.randomUUID();
</script>

<article class="flex flex-col rounded-md border border-solid border-gray-200 bg-gray-50 p-4">
	<div class="mb-2 flex items-center justify-between">
		<div class=" text-lg">{title}</div>
		<Button size="sm" {@attach (node: HTMLElement) => clickToCopy(node, '#' + randomId)}
			>Copy</Button
		>
	</div>
	<div
		class="mb-2 min-h-10 flex-1 rounded border border-solid border-gray-300 bg-white p-2 text-sm wrap-break-word"
		id={randomId}
	>
		{value}
	</div>
	<div class="text-xs">{subtitle}</div>
</article>
