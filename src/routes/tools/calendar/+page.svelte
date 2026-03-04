<script lang="ts">
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import { CalendarDate } from '@internationalized/date';
	import { onMount } from 'svelte';
	import * as NativeSelect from '$lib/components/ui/native-select/index.js';
	import Label from '$lib/components/ui/label/label.svelte';

	const now = new Date();
	let value = $state<CalendarDate | undefined>(new CalendarDate(now.getFullYear(), 1, 1));

	onMount(() => {
		value = new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
	});

	const years = Array.from({ length: 100 }, (_, i) => now.getFullYear() - 50 + i);
	let selectedYear = $state(now.getFullYear());
	let selectedDisplayLayout = $state('year');

	const displayLayout = [
		{ label: 'Year', value: 'year' },
		{ label: 'Month', value: 'month' },
		{ label: 'Week', value: 'week' },
		{ label: 'Work Week', value: 'work-week' }
	];
</script>

<Label class="mb-2">Select a year</Label>
<NativeSelect.Root bind:value={selectedYear}>
	{#each years as year}
		<NativeSelect.Option value={year}>{year}</NativeSelect.Option>
	{/each}
</NativeSelect.Root>

<Label class="my-2">Display</Label>
<NativeSelect.Root bind:value={selectedDisplayLayout}>
	{#each displayLayout as layout}
		<NativeSelect.Option value={layout.value}>{layout.label}</NativeSelect.Option>
	{/each}
</NativeSelect.Root>

<div>
	<Calendar
		bind:value
		type="single"
		class="rounded-md border shadow-sm w-fit "
		captionLayout="dropdown"
		numberOfMonths={12}
	/>
</div>
