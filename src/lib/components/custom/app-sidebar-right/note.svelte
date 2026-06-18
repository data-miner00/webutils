<script lang="ts">
	import { XIcon } from '@lucide/svelte';
	import { type ComponentProps, onMount } from 'svelte';

	import Button from '$lib/components/ui/button/button.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';

	let { ref = $bindable(null) }: ComponentProps<typeof Sidebar.Root> = $props();

	const noteLocalStorageKey = 'localNote';
	let note = $state('');

	onMount(() => {
		note = localStorage.getItem(noteLocalStorageKey) || '';
	});

	$effect(() => {
		localStorage.setItem(noteLocalStorageKey, note);
	});

	function clear() {
		note = '';
	}
</script>

<Sidebar.Group class="py-0">
	<Sidebar.GroupLabel class="group/label text-sidebar-foreground  w-full text-sm">
		Note
	</Sidebar.GroupLabel>
	<Sidebar.GroupAction>
		<Button size="icon-sm" variant="ghost" onclick={clear}><XIcon /></Button>
	</Sidebar.GroupAction>

	<Sidebar.GroupContent class="p-2">
		<Sidebar.Menu>
			<Textarea placeholder="Type your note here." />
		</Sidebar.Menu>
	</Sidebar.GroupContent>
</Sidebar.Group>

<Sidebar.Separator class="mx-0" />
