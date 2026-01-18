<script lang="ts">
	import { extractDomain } from '$lib/core/links';

	type Props = {
		url: string;
		title: string;
		language?: string;
	};

	let { url, title, language }: Props = $props();

	let domain = $derived(extractDomain(url));
</script>

<a
	class="flex px-4 py-2 h-20 rounded-lg bg-gray-50 items-center relative"
	href={url}
	target="_blank"
>
	<div>
		<div class="w-6 h-6 rounded-full flex items-center">
			<img
				class="block"
				src={`https://www.google.com/s2/favicons?sz=32&domain_url=${url}`}
				alt="Favicon"
			/>
		</div>
	</div>
	<div class="ml-4 w-[200px]">
		<p>{title}</p>
		<p class="text-xs text-muted-foreground lowercase">{domain}</p>
	</div>
	<div
		class="absolute top-1/2 right-4 -translate-y-1/2 border border-solid border-gray-500 text-gray-500 px-1 rounded uppercase text-xs"
	>
		{language || 'En'}
	</div>
</a>
