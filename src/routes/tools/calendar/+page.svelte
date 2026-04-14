<script lang="ts">
	import { CalendarDate } from '@internationalized/date';
	import { onMount } from 'svelte';

	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as NativeSelect from '$lib/components/ui/native-select/index.js';

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

<div class="px-4 py-6">
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
			class="w-fit rounded-md border shadow-sm "
			captionLayout="dropdown"
			numberOfMonths={12}
		/>
	</div>
</div>
