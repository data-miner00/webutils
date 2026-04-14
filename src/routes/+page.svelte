<script lang="ts">
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { onMount } from 'svelte';

	import LinkComponent from '$lib/components/custom/link/link.svelte';
	import Localhost from '$lib/components/custom/localhost/localhost.svelte';
	import Timer from '$lib/components/custom/timer/timer.svelte';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import { db, initializeDatabase } from '$lib/core/Database';
	import { IndexedDBRepository } from '$lib/core/IndexedDbRepository';
	import { type Link, STORE_NAME, defaultLinks } from '$lib/core/links';

	let value = $state(today(getLocalTimeZone()));

	let links = $state<Link[]>([]);
	const MAX_LINKS_COUNT = 8;

	onMount(async () => {
		if (!db.isDbInitialized) {
			await initializeDatabase();
		}

		const repository = new IndexedDBRepository<Link>(db, STORE_NAME);
		links = await repository.getAll(MAX_LINKS_COUNT);

		if (!links.length) {
			links = defaultLinks;
			links.forEach(async (link) => {
				const nonProxyLink = $state.snapshot(link);
				await repository.create(nonProxyLink);
			});
		}
	});
</script>

<div class="h-full px-4 py-6">
	<!-- <div>
		<Calendar
			type="single"
			bind:value
			class="w-fit rounded-md border shadow-sm"
			captionLayout="dropdown"
		/>

		<div class="my-2"></div>

		<Timer />
	</div> -->

	<div>
		<h2 class="mb-4 text-xl font-bold">Links</h2>
		<div class="mb-5 flex flex-wrap gap-4">
			{#each links as link, index (index)}
				<LinkComponent url={link.url} title={link.title} language={link.language} />
			{/each}
		</div>

		<!-- <div>
			<Localhost />
		</div> -->
	</div>
</div>
