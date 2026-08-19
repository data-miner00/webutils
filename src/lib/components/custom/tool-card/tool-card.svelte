<script lang="ts">
	import { Star } from '@lucide/svelte';

	import { Button } from '$lib/components/ui/button';

	type Props = {
		title: string;
		url: string;
		category: string;
		isFavorite: boolean;
		onToggleFavorite: () => void;
	};

	let { title, url, category, isFavorite, onToggleFavorite }: Props = $props();
</script>

<a
	class="relative flex h-16 items-center rounded-lg bg-gray-50 px-4 py-2 dark:bg-gray-900"
	href={url}
>
	<div>
		<p>{title}</p>
		<p class="text-muted-foreground text-xs">{category}</p>
	</div>

	<Button
		onclick={(e) => {
			e.preventDefault();
			onToggleFavorite();
		}}
		class="ml-auto cursor-pointer"
		size="icon-sm"
		variant="ghost"
	>
		<Star size={16} fill={isFavorite ? 'currentColor' : 'none'} />
	</Button>
</a>
