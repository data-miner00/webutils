<script lang="ts">
	import { CalendarIcon, PencilIcon } from '@lucide/svelte';
	import type { ComponentProps } from 'svelte';

	import { goto } from '$app/navigation';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	import DatePicker from './date-picker.svelte';
	import NavUser from './nav-user.svelte';
	import Note from './note.svelte';

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root
	bind:ref
	collapsible="none"
	class="sticky top-0 hidden h-svh border-s lg:flex"
	{...restProps}
>
	<Sidebar.Header class="border-sidebar-border h-16 border-b">
		<NavUser />
	</Sidebar.Header>
	<Sidebar.Content>
		<DatePicker />
		<Sidebar.Menu class="px-2">
			<Sidebar.MenuItem>
				<Sidebar.MenuButton onclick={() => goto('/tools/calendar')}>
					<CalendarIcon />
					<span>View Calendar</span>
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>

		<Sidebar.Separator class="mx-0" />
		<Note />
	</Sidebar.Content>
	<Sidebar.Footer>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton>
					<PencilIcon />
					<span>Edit Widgets</span>
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
</Sidebar.Root>
