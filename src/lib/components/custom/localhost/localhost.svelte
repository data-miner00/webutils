<script lang="ts">
	import { ArrowDownUp, Copy, SquareArrowOutUpRight } from '@lucide/svelte';

	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { Input } from '$lib/components/ui/input';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Select from '$lib/components/ui/select';
	import { Spinner } from '$lib/components/ui/spinner';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import { generateUrl } from '$lib/core/localhost';

	let port = $state(3000);
	let isHttps = $state(true);
	let format: 'localhost' | 'loopback' | 'ipv6' = $state('localhost');

	let localhostUrl = $derived(generateUrl(isHttps, format, port));
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

<div class="max-w-md rounded-lg p-4 shadow">
	<div class="mb-1 font-bold">Preview</div>
	<Select.Root type="single" name="imageFormat" bind:value={format}>
		<Select.Trigger>
			{localhostUrl}
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>Format</Select.Label>
				<Select.Item value="localhost" label="localhost"
					>{generateUrl(isHttps, 'localhost', port)}</Select.Item
				>
				<Select.Item value="loopback" label="loopback"
					>{generateUrl(isHttps, 'loopback', port)}</Select.Item
				>
				<Select.Item value="ipv6" label="ipv6">{generateUrl(isHttps, 'ipv6', port)}</Select.Item>
			</Select.Group>
		</Select.Content>
	</Select.Root>

	<Label class="mb-1 text-base font-bold" for="port">Port</Label>
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
	<div class="mb-4 flex items-center gap-3">
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
