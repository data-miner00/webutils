<script lang="ts">
	import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	type Props = {
		id: string;
		emoji: string;
		link: string;
		name: string;
	};

	let { name, link, emoji }: Props = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon" class="relative size-8 p-0">
				<span class="sr-only">Open menu</span>
				<EllipsisIcon />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>Actions</DropdownMenu.Label>
			<DropdownMenu.Item onclick={() => navigator.clipboard.writeText(emoji)}>
				Copy flag emoji
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>
			<a href={link} target="_blank" rel="noopener noreferrer" class="w-full h-full">Visit link</a>
		</DropdownMenu.Item>
		<DropdownMenu.Item
			onclick={() =>
				window.open(`https://www.google.com/search?q=${encodeURIComponent(name)}`, '_blank')}
			>Google search</DropdownMenu.Item
		>
	</DropdownMenu.Content>
</DropdownMenu.Root>
