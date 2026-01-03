<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { Input } from '$lib/components/ui/input';
	import Label from '$lib/components/ui/label/label.svelte';
	import { copyText } from '$lib/core/copy-to-clipboard';

	let port = $state(3000);
	let isHttps = $state(true);
	const LOCALHOST = 'localhost';

	let localhostUrl = $derived((isHttps ? 'https' : 'http') + '://' + LOCALHOST + ':' + port);

	type PingStatus = 'unknown' | 'online' | 'offline';

	let urlStatus = $state<PingStatus>('unknown');

	$effect(() => {
		port && (urlStatus = 'unknown');
	});

	async function ping() {
		try {
			const response = await fetch(urlStatus, {
				method: 'head'
			});

			if (response.status === 200) {
				urlStatus = 'online';
			} else {
				urlStatus = 'offline';
			}
		} catch {
			urlStatus = 'offline';
		}
	}

	function copyUrl() {
		return copyText(localhostUrl);
	}
</script>

<div class="border border-solid border-black p-4">
	<!-- preview -->
	<div class="bg-gray-100 rounded">
		{isHttps ? 'https' : 'http'}://{LOCALHOST}:{port}
	</div>

	<Label for="port">Port</Label>
	<Input name="port" placeholder="e.g. 3000" min={1} max={65535} bind:value={port} />

	<div>
		<Button variant="outline" onclick={ping}>Ping</Button>
		<Button variant="outline" onclick={copyUrl}>Copy</Button>
		<Button variant="outline" href={localhostUrl} target="_blank">Visit</Button>
	</div>

	<div class="flex items-center gap-3">
		<Checkbox id="https" bind:checked={isHttps} />
		<Label for="https">Using HTTPS protocol</Label>
	</div>

	<div>Status: {urlStatus}</div>
</div>
