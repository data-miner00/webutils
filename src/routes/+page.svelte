<script>
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import Timer from '$lib/components/custom/timer/timer.svelte';

	let value = today(getLocalTimeZone());

	import { defaultLinks } from '$lib/core/links';
	import Link from '$lib/components/custom/link/link.svelte';
</script>

<div class="flex gap-4">
	<div>
		<Calendar
			type="single"
			bind:value
			class="rounded-md border shadow-sm w-fit"
			captionLayout="dropdown"
		/>

		<div class="my-2"></div>

		<Timer />
	</div>

	<div>
		<h2 class="text-xl font-bold mb-4">Links</h2>
		<div class="flex gap-4 flex-wrap">
			{#each defaultLinks as link (link.id)}
				<Link url={link.url} title={link.title} language={link.language} />
			{/each}
		</div>
	</div>
</div>

<!-- <img src="x" onerror={alert('XSS Attack!')} /> -->
