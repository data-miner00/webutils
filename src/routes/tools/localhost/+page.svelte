<script lang="ts">
	import {
		AlertCircleIcon,
		ArrowDownUp,
		Copy,
		Pencil,
		Plus,
		RefreshCcw,
		SquareArrowOutUpRight,
		Trash2
	} from '@lucide/svelte';

	import * as Alert from '$lib/components/ui/alert/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { Input } from '$lib/components/ui/input';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Select from '$lib/components/ui/select';
	import { Spinner } from '$lib/components/ui/spinner';
	import * as Table from '$lib/components/ui/table/index.js';
	import { copyText } from '$lib/core/copy-to-clipboard';

	type LocalhostFormat = 'localhost' | 'loopback' | 'ipv6';
	type OnlineStatus = 'online' | 'offline' | 'unknown';

	type LocalhostAssociation = {
		name: string;
		description: string;
		port: number;
		format: LocalhostFormat;
		isHttps: boolean;
	};

	const mockAssociations: LocalhostAssociation[] = [
		{
			name: 'Reporting API',
			description: 'An API for reporting in ASP.NET',
			port: 51623,
			format: 'localhost',
			isHttps: true
		},
		{
			name: 'Messaging API',
			description: 'An API for messaging in Flask Python',
			port: 3333,
			format: 'localhost',
			isHttps: false
		},
		{
			name: 'WhatsApp API',
			description: 'An API to interact with WhatsApp',
			port: 3443,
			format: 'localhost',
			isHttps: false
		},
		{
			name: 'CRM API',
			description: 'An API for managing CRM',
			port: 7777,
			format: 'loopback',
			isHttps: true
		}
	];

	let port = $state(3000);
	let isHttps = $state(true);
	let format: 'localhost' | 'loopback' | 'ipv6' = $state('localhost');
	const LOCALHOST = 'localhost';
	const LOOPBACK = '172.0.0.1';
	const IPV6 = '[::1]';

	function generateUrl(isHttpsx: boolean, formatx: string, portx: number): string {
		const protocol = isHttpsx ? 'https' : 'http';
		const localhost = formatx == 'loopback' ? LOOPBACK : formatx == 'ipv6' ? IPV6 : LOCALHOST;

		return `${protocol}://${localhost}:${portx}`;
	}

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

<h2 class="mb-4 text-xl">URL Builder</h2>

<div class="mb-12">
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

	{#if port < 1 || port > 65536}
		<Alert.Root variant="destructive">
			<AlertCircleIcon />
			<Alert.Title>Invalid Port Number</Alert.Title>
			<Alert.Description>
				<p>The port number must be</p>
				<ul class="list-inside list-disc text-sm">
					<li>Not lower than 1</li>
					<li>Not higher than 65535</li>
				</ul>
			</Alert.Description>
		</Alert.Root>
	{/if}

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
		<Button class="cursor-pointer" variant="outline" size="icon" onclick={() => {}}>
			<Plus />
		</Button>
	</div>

	<div>Status: {urlStatus}</div>
</div>

<h2 class="mb-4 text-xl">Saved associations</h2>

<div>
	<Table.Root>
		<Table.Caption>A list of your saved local development endpoint.</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-[100px]">Name</Table.Head>
				<Table.Head>Description</Table.Head>
				<Table.Head>URL</Table.Head>
				<Table.Head>Status</Table.Head>
				<Table.Head>Actions</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each mockAssociations as association (association.name)}
				{@const associationUrl = generateUrl(
					association.isHttps,
					association.format,
					association.port
				)}
				<Table.Row>
					<Table.Cell class="font-medium">{association.name}</Table.Cell>
					<Table.Cell>{association.description}</Table.Cell>
					<Table.Cell>
						{associationUrl}
					</Table.Cell>
					<Table.Cell>
						<span class="text-green-500">●</span> Online
					</Table.Cell>
					<Table.Cell>
						<ButtonGroup.Root>
							<Button variant="outline" onclick={() => copyText(associationUrl)}>
								<Copy />
							</Button>
							<Button variant="outline" onclick={() => window.open(associationUrl, '_blank')}>
								<SquareArrowOutUpRight />
							</Button>
							<Button variant="outline" onclick={() => {}}>
								<RefreshCcw />
							</Button>
							<Button variant="outline" onclick={() => {}}>
								<Pencil />
							</Button>
							<Button variant="destructive" onclick={() => {}}>
								<Trash2 />
							</Button>
						</ButtonGroup.Root>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
