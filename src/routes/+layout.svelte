<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/custom/shared/header.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/custom/app-sidebar/app-sidebar.svelte';
	import { goto } from '$app/navigation';

	let { children } = $props();
	let isCommandOpen = $state(false);
	import CalculatorIcon from '@lucide/svelte/icons/calculator';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import CreditCardIcon from '@lucide/svelte/icons/credit-card';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import SmileIcon from '@lucide/svelte/icons/smile';
	import UserIcon from '@lucide/svelte/icons/user';
	import * as Command from '$lib/components/ui/command/index.js';
	import { Clock10 } from '@lucide/svelte';

	function fetchImage(id: number): string {
		return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
	}

	function focusSearch() {
		const searchInput = document.getElementById('search-input');
		searchInput?.focus();
	}

	function onKeyDown(event: KeyboardEvent) {
		if (event.repeat) return;

		switch (event.key) {
			case 'k':
				if (event.ctrlKey) {
					event.preventDefault();
					focusSearch();
				}
				break;
			case 'j':
				if (event.ctrlKey) {
					event.preventDefault();
					isCommandOpen = true;
				}
			default:
				break;
		}
	}

	function onSelectCalendar() {
		goto('/tools/calendar');
		isCommandOpen = false;
	}

	function onSelectEmoji() {
		goto('/tools/emoji');
		isCommandOpen = false;
	}

	function onSelectClock() {
		goto('/tools/clock');
		isCommandOpen = false;
	}
</script>

<svelte:window onkeydown={onKeyDown} />

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Webutils</title>
	<meta name="description" content="A collection of web utilities built with SvelteKit." />
</svelte:head>

<Toaster position="top-center" />

<Sidebar.Provider>
	<AppSidebar />

	<main class="w-full">
		<Header />
		<div class="px-4 py-6">
			{@render children()}
		</div>
	</main>
</Sidebar.Provider>

<div class="fixed bottom-2 right-2">
	<img src={fetchImage(151)} alt="Showing a pokemon" onerror={(e) => e.currentTarget.remove()} />
</div>

<Command.Dialog bind:open={isCommandOpen}>
	<Command.Input placeholder="Type a command or search..." />
	<Command.List>
		<Command.Empty>No results found.</Command.Empty>
		<Command.Group heading="Suggestions">
			<Command.Item onSelect={onSelectCalendar}>
				<CalendarIcon class="me-2 size-4" />
				<span>Calendar</span>
			</Command.Item>
			<Command.Item onSelect={onSelectEmoji}>
				<SmileIcon class="me-2 size-4" />
				<span>Search Emoji</span>
			</Command.Item>
			<Command.Item onSelect={onSelectClock}>
				<Clock10 class="me-2 size-4" />
				<span>Clock</span>
			</Command.Item>
			<Command.Item>
				<CalculatorIcon class="me-2 size-4" />
				<span>Calculator</span>
			</Command.Item>
		</Command.Group>
		<Command.Separator />
		<Command.Group heading="Settings">
			<Command.Item>
				<UserIcon class="me-2 size-4" />
				<span>Profile</span>
				<Command.Shortcut>⌘P</Command.Shortcut>
			</Command.Item>
			<Command.Item>
				<CreditCardIcon class="me-2 size-4" />
				<span>Billing</span>
				<Command.Shortcut>⌘B</Command.Shortcut>
			</Command.Item>
			<Command.Item>
				<SettingsIcon class="me-2 size-4" />
				<span>Settings</span>
				<Command.Shortcut>⌘S</Command.Shortcut>
			</Command.Item>
		</Command.Group>
	</Command.List>
</Command.Dialog>
