<script lang="ts">
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import Timer from '$lib/components/custom/timer/timer.svelte';

	let value = $state(today(getLocalTimeZone()));

	import { defaultLinks, type Link, getAllLinks, addLink } from '$lib/core/links';
	import LinkComponent from '$lib/components/custom/link/link.svelte';
	import { fetchIpInfo, type IpInfo } from '$lib/core/ip-address';
	import { onMount } from 'svelte';
	import { MapPin } from '@lucide/svelte';
	import Localhost from '$lib/components/custom/localhost/localhost.svelte';

	let ipState = $state<IpInfo>();
	let links = $state<Link[]>([]);
	const MAX_LINKS_COUNT = 8;

	onMount(async () => {
		ipState = await fetchIpInfo();
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

		<div class="p-4 rounded border border-solid border-black flex gap-4 items-center">
			<div>
				<MapPin />
			</div>
			<div>
				<p class="font-bold">{ipState?.ip}</p>
				<p>{ipState?.city}, {ipState?.country}</p>
			</div>
		</div>

		<div>
			<Localhost />
		</div>
	</div>
</div>

<!-- <img src="x" onerror={alert('XSS Attack!')} /> -->
