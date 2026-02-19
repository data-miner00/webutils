<script lang="ts">
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import { CalendarDate } from '@internationalized/date';
	import { onMount } from 'svelte';

	const now = new Date();
	let value = $state<CalendarDate | undefined>(new CalendarDate(now.getFullYear(), 1, 1));

	onMount(() => {
		value = new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
	});
</script>

<div>
	<Calendar
		bind:value
		type="single"
		class="rounded-md border shadow-sm w-fit "
		captionLayout="dropdown"
		numberOfMonths={12}
	/>
</div>
