<script lang="ts">
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import Timer from '$lib/components/custom/timer/timer.svelte';

	let value = $state(today(getLocalTimeZone()));

	import { defaultLinks, type Link, STORE_NAME } from '$lib/core/links';
	import LinkComponent from '$lib/components/custom/link/link.svelte';
	import { onMount } from 'svelte';
	import Localhost from '$lib/components/custom/localhost/localhost.svelte';
	import * as wasm from '../../rust-pkg/pkg/rust_pkg.js';
	import { toast } from 'svelte-sonner';
	import { db, initializeDatabase } from '$lib/core/Database';
	import { IndexedDBRepository } from '$lib/core/IndexedDbRepository';

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

		toast.info(`20 + 13 = ${wasm.add(20n, 13n)}`);
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
