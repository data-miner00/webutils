<script lang="ts">
	import { CalendarDate } from '@internationalized/date';
	import { ChevronLeft, ChevronRight, ClockIcon } from '@lucide/svelte';
	import { onMount } from 'svelte';

	import Button from '$lib/components/ui/button/button.svelte';
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import * as NativeSelect from '$lib/components/ui/native-select/index.js';

	const now = new Date();
	let value = $state<CalendarDate | undefined>(new CalendarDate(now.getFullYear(), 1, 1));

	onMount(() => {
		value = new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
	});

	const years = Array.from({ length: 100 }, (_, i) => now.getFullYear() - 50 + i);

	let selectedYear = $state(now.getFullYear());

	// Do I still need this?
	const displayLayout = [
		{ label: 'Year', value: 'year' },
		{ label: 'Month', value: 'month' },
		{ label: 'Week', value: 'week' },
		{ label: 'Work Week', value: 'work-week' }
	];

	function setNewYear(year: number) {
		selectedYear = year;
		value = new CalendarDate(year, 1, 1);
	}
</script>

<!-- TODO: Show year progress: today/days left -->

<div class="px-4 py-6">
	<div class="mb-6 flex items-center gap-2">
		<Button variant="outline" size="icon-sm" onclick={() => setNewYear(selectedYear - 1)}
			><ChevronLeft /></Button
		>
		<Button
			variant="outline"
			size="sm"
			class="cursor-pointer"
			onclick={() => setNewYear(selectedYear - 2)}
		>
			{selectedYear - 2}
		</Button>
		<Button
			variant="outline"
			size="sm"
			class="cursor-pointer"
			onclick={() => setNewYear(selectedYear - 1)}
		>
			{selectedYear - 1}
		</Button>
		<Button size="sm" class="cursor-pointer">
			{selectedYear}
		</Button>
		<Button
			variant="outline"
			size="sm"
			class="cursor-pointer"
			onclick={() => setNewYear(selectedYear + 1)}
		>
			{selectedYear + 1}
		</Button>
		<Button
			variant="outline"
			size="sm"
			class="cursor-pointer"
			onclick={() => setNewYear(selectedYear + 2)}
		>
			{selectedYear + 2}
		</Button>
		<Button variant="outline" size="icon-sm" onclick={() => setNewYear(selectedYear + 1)}
			><ChevronRight /></Button
		>

		<NativeSelect.Root bind:value={selectedYear}>
			{#each years as year}
				<NativeSelect.Option value={year} onclick={() => setNewYear(year)}>
					{year}
				</NativeSelect.Option>
			{/each}
		</NativeSelect.Root>

		<Button onclick={() => setNewYear(now.getFullYear())}>
			<ClockIcon /> Today
		</Button>

		<!-- TODO: Set to range date and display how many days selected -->
	</div>

	<div>
		<Calendar bind:value type="single" class="w-fit" captionLayout="label" numberOfMonths={12} />
	</div>
</div>
