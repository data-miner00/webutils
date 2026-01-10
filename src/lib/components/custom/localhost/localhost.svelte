<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { Input } from '$lib/components/ui/input';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Spinner } from '$lib/components/ui/spinner';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import { ArrowDownUp, Copy, SquareArrowOutUpRight } from '@lucide/svelte';

	let port = $state(3000);
	let isHttps = $state(true);
	const LOCALHOST = 'localhost';

	let localhostUrl = $derived((isHttps ? 'https' : 'http') + '://' + LOCALHOST + ':' + port);
	let isPinging = $state(false);

	type PingStatus = 'unknown' | 'online' | 'offline';

	let urlStatus = $state<PingStatus>('unknown');

	$effect(() => {
		port && (urlStatus = 'unknown');
	});

	async function ping() {
		isPinging = true;
		try {
			const response = await fetch(localhostUrl, {
				method: 'head'
			});

			if (response.status === 200) {
				urlStatus = 'online';
			} else {
				urlStatus = 'offline';
			}
		} catch {
			urlStatus = 'offline';
		} finally {
			isPinging = false;
		}
	}

	function copyUrl() {
		return copyText(localhostUrl);
	}

	function openInNewTab() {
		window.open(localhostUrl, '_blank');
	}
</script>

<div class="shadow p-4 max-w-md rounded-lg">
	<div class="mb-1 font-bold">Preview</div>
	<!-- ipv6, loopback or etc selection -->
	<div class="bg-gray-100 rounded-lg px-4 py-2 font-mono mb-4">
		{isHttps ? 'https' : 'http'}://{LOCALHOST}:{port}
	</div>

	<Label class="mb-1 font-bold text-base" for="port">Port</Label>
	<Input
		name="port"
		placeholder="e.g. 3000"
		min={1}
		max={65535}
		bind:value={port}
		type="number"
		class="mb-4"
	/>

	<div class="mb-1 font-bold">Options</div>
	<div class="flex items-center gap-3 mb-4">
		<Checkbox id="https" bind:checked={isHttps} />
		<Label for="https">Using HTTPS protocol</Label>
	</div>

	<div class="mb-1 font-bold">Actions</div>
	<div class="mb-2">
		<Button class="cursor-pointer" variant="outline" onclick={ping} disabled={isPinging}>
			{#if isPinging}
				<Spinner /> Pinging
			{:else}
				<ArrowDownUp /> Ping
			{/if}
		</Button>
		<Button class="cursor-pointer" variant="outline" size="icon" onclick={copyUrl}>
			<Copy />
		</Button>
		<Button class="cursor-pointer" variant="outline" size="icon" onclick={openInNewTab}>
			<SquareArrowOutUpRight />
		</Button>
	</div>

	<div>Status: {urlStatus}</div>
</div>
