<script lang="ts">
	import { Settings, Trash2 } from '@lucide/svelte';

	import { Button } from '$lib/components/ui/button';
	import { extractDomain } from '$lib/core/links';

	type Props = {
		url: string;
		title: string;
		language?: string;
		onClickEdit?: () => void;
		onClickDelete?: () => void;
	};

	let { url, title, language, onClickEdit, onClickDelete }: Props = $props();

	let domain = $derived(extractDomain(url));

	// `https://icons.duckduckgo.com/ip3/${extractDomain(url)}.ico`
	// https://blog.jim-nielsen.com/2021/displaying-favicons-for-any-domain/
</script>

<a
	class="relative flex h-20 items-center rounded-lg bg-gray-50 px-4 py-2 dark:bg-gray-900"
	href={url}
	target="_blank"
>
	<div>
		<div class="flex h-6 w-6 items-center rounded-full">
			<img
				class="block"
				src={`https://www.google.com/s2/favicons?sz=32&domain_url=${url}`}
				alt="Favicon"
			/>
		</div>
	</div>
	<div class="ml-4 w-[200px]">
		<p>{title}</p>
		<p class="text-muted-foreground text-xs lowercase">{domain} · {language || 'En'}</p>
	</div>

	<div class="ml-auto flex gap-2">
		{#if onClickEdit}
			<Button
				onclick={(e) => {
					e.preventDefault();
					onClickEdit?.();
				}}
				class="ml-auto cursor-pointer"
				size="icon-sm"
				variant="ghost"
			>
				<Settings size={16} />
			</Button>
		{/if}
		{#if onClickDelete}
			<Button
				onclick={(e) => {
					e.preventDefault();
					onClickDelete?.();
				}}
				class="ml-auto cursor-pointer"
				size="icon-sm"
				variant="ghost"
			>
				<Trash2 size={16} />
			</Button>
		{/if}
	</div>
</a>
