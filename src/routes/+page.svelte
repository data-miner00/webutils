<script lang="ts">
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import Timer from '$lib/components/custom/timer/timer.svelte';

	let value = $state(today(getLocalTimeZone()));

	import { defaultLinks, type Link, getAllLinks, addLink } from '$lib/core/links';
	import LinkComponent from '$lib/components/custom/link/link.svelte';
	import { onMount } from 'svelte';
	import Localhost from '$lib/components/custom/localhost/localhost.svelte';

	let links = $state<Link[]>([]);
	const MAX_LINKS_COUNT = 8;

	onMount(async () => {
		links = await getAllLinks(MAX_LINKS_COUNT);

		if (!links.length) {
			links = defaultLinks;
			links.forEach(async (link) => {
				const nonProxyLink = $state.snapshot(link);
				await addLink(nonProxyLink);
			});
		}
	});
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
		<div class="flex gap-4 flex-wrap mb-5">
			{#each links as link, index (index)}
				<LinkComponent url={link.url} title={link.title} language={link.language} />
			{/each}
		</div>

		<div>
			<Localhost />
		</div>
	</div>
</div>

<!-- <img src="x" onerror={alert('XSS Attack!')} /> -->
