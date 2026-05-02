<script lang="ts">
	import { Copy } from '@lucide/svelte';
	import { Album, Clipboard, EllipsisVertical, Trash2 } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as InputGroup from '$lib/components/ui/input-group';
	import * as Label from '$lib/components/ui/label/index.js';
	import { copyText } from '$lib/core/copy-to-clipboard';

	let input = $state('');
	let parsedUrl: URL | null = $state(null);

	$effect(() => {
		try {
			parsedUrl = new URL(input);
		} catch (e) {
			parsedUrl = null;
		}
	});

	const examples = [
		{
			title: 'Example 1',
			url: 'https://www.example.com/path?query=123#hash'
		},
		{
			title: 'Example 2',
			url: 'https://www.google.com/search?q=svelte&rlz=1C1GCEU_enUS832US832&oq=svelte&aqs=chrome..69i57j0i433i512l9.1234j0j7&sourceid=chrome&ie=UTF-8#hash'
		},
		{
			title: 'Example 3',
			url: 'https://github.com/sveltejs/svelte/issues/1234'
		}
	];

	function copyAsJson() {
		if (!parsedUrl) {
			toast.error('No valid URL to copy');
			return;
		}
		const urlData = {
			protocol: parsedUrl.protocol,
			host: parsedUrl.host,
			pathname: parsedUrl.pathname,
			search: parsedUrl.search,
			hash: parsedUrl.hash
		};
		copyText(JSON.stringify(urlData, null, 2));
	}
</script>

<div class="mx-auto mt-10 max-w-xl">
	<header class="mb-20">
		<h1 class="block text-center text-xl font-bold">URL Parser</h1>
		<p class="text-muted-foreground text-center">Enter a valid URL below to be parsed.</p>
	</header>

	<div class="flex flex-col gap-6 rounded-lg border border-solid border-gray-300 p-8">
		<div class="flex justify-end">
			<div class="flex items-center gap-2">
				<ButtonGroup.Root>
					<ButtonGroup.Root>
						<Button variant="outline" onclick={() => (input = examples[0].url)}>Example 1</Button>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								{#snippet child({ props })}
									<Button {...props} variant="outline" aria-label="More Options">
										<EllipsisVertical />
									</Button>
								{/snippet}
							</DropdownMenu.Trigger>
							<DropdownMenu.Content align="end" class="w-52">
								<DropdownMenu.Group>
									<DropdownMenu.Item onclick={() => (input = examples[1].url)}>
										<Album />
										Example 2
									</DropdownMenu.Item>
									<DropdownMenu.Item onclick={() => (input = examples[2].url)}>
										<Album />
										Example 3
									</DropdownMenu.Item>
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</ButtonGroup.Root>
					<ButtonGroup.Root>
						<Button size="icon" variant="destructive" onclick={() => (input = '')}
							><Trash2 /></Button
						>
					</ButtonGroup.Root>
				</ButtonGroup.Root>
			</div>
		</div>

		<InputGroup.Root>
			<InputGroup.Input id="url" placeholder="Enter URL" bind:value={input} />
			<InputGroup.Addon align="block-start">
				<Label.Root for="url" class="text-foreground">Input</Label.Root>
			</InputGroup.Addon>
		</InputGroup.Root>

		<div class="rounded border border-gray-300">
			<div class="max-w-full overflow-x-auto border-b border-solid border-gray-300 p-4">
				<div class="text-xs text-gray-700">Protocol</div>

				{#if parsedUrl?.protocol}
					<div>
						{parsedUrl.protocol}
						<Button variant="ghost" size="sm" onclick={() => copyText(parsedUrl!.protocol)}
							><Copy /></Button
						>
					</div>
				{:else}
					<div class="text-gray-500">No protocol</div>
				{/if}
			</div>
			<div class="max-w-full overflow-x-auto border-b border-solid border-gray-300 p-4">
				<div class="text-xs text-gray-700">Host</div>
				{#if parsedUrl?.host}
					<div>
						{parsedUrl.host}
						<Button variant="ghost" size="sm" onclick={() => copyText(parsedUrl!.host)}
							><Copy /></Button
						>
					</div>
				{:else}
					<div class="text-gray-500">No host</div>
				{/if}
			</div>
			<div class="max-w-full overflow-x-auto border-b border-solid border-gray-300 p-4">
				<div class="text-xs text-gray-700">Pathname</div>
				{#if parsedUrl?.pathname}
					<div>
						{parsedUrl.pathname}
						<Button variant="ghost" size="sm" onclick={() => copyText(parsedUrl!.pathname)}
							><Copy /></Button
						>
					</div>
				{:else}
					<div class="text-gray-500">No pathname</div>
				{/if}
			</div>
			<div class="max-w-full overflow-x-auto border-b border-solid border-gray-300 p-4">
				<div class="text-xs text-gray-700">Search Params</div>
				{#if parsedUrl?.search}
					<div>
						{parsedUrl.search}

						<Button variant="ghost" size="sm" onclick={() => copyText(parsedUrl!.search)}
							><Copy /></Button
						>
					</div>
				{:else}
					<div class="text-gray-500">No params</div>
				{/if}
			</div>
			<div class="max-w-full overflow-x-auto p-4">
				<div class="text-xs text-gray-700">Hash</div>
				{#if parsedUrl?.hash}
					<div>
						{parsedUrl.hash}
						<Button variant="ghost" size="sm" onclick={() => copyText(parsedUrl!.hash)}
							><Copy /></Button
						>
					</div>
				{:else}
					<div class="text-gray-500">No hash</div>
				{/if}
			</div>
		</div>

		<ButtonGroup.Root class="ml-auto">
			<Button onclick={copyAsJson} disabled={!parsedUrl}><Clipboard /> Copy as JSON</Button>
		</ButtonGroup.Root>
	</div>
</div>
