<script lang="ts">
	import { Copy } from '@lucide/svelte';
	import CodeEditor from '$lib/components/custom/code-editor/code-editor.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { EllipsisVertical, Trash2, Clipboard, Album, Download } from '@lucide/svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import { toast } from 'svelte-sonner';

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

<div class="mb-4 flex h-screen">
	<section class="flex-1 pr-4">
		<header class="flex justify-between mb-6">
			<h1 class="text-xl font-bold block">URL Parser</h1>
			<div class="flex items-center gap-4">
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
		</header>
		<CodeEditor class="h-[500px]!" language="text" bind:value={input} />
	</section>

	<section class="flex-1 pl-4">
		<header class="flex justify-between mb-6">
			<h2 class="text-xl font-bold block">Output</h2>

			<ButtonGroup.Root>
				<Button variant="outline" onclick={copyAsJson}><Clipboard /> Copy as JSON</Button>
			</ButtonGroup.Root>
		</header>

		{#if parsedUrl}
			<div>
				<div
					class="border border-b-0 p-4 border-solid border-gray-300 h-20 max-w-full overflow-x-auto"
				>
					<div class="text-xs text-gray-700">Protocol</div>
					<div>
						{parsedUrl.protocol}
						<Button variant="ghost" size="sm" onclick={() => copyText(parsedUrl!.protocol)}
							><Copy /></Button
						>
					</div>
				</div>
				<div
					class="border border-b-0 p-4 border-solid border-gray-300 h-20 max-w-full overflow-x-auto"
				>
					<div class="text-xs text-gray-700">Host</div>
					<div>
						{parsedUrl.host}
						<Button variant="ghost" size="sm" onclick={() => copyText(parsedUrl!.host)}
							><Copy /></Button
						>
					</div>
				</div>
				<div
					class="border border-b-0 p-4 border-solid border-gray-300 h-20 max-w-full overflow-x-auto"
				>
					<div class="text-xs text-gray-700">Pathname</div>
					{#if parsedUrl.pathname}
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
				<div
					class="border border-b-0 p-4 border-solid border-gray-300 h-20 max-w-full overflow-x-auto"
				>
					<div class="text-xs text-gray-700">Search Params</div>
					{#if parsedUrl.search}
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
				<div class="border p-4 border-solid border-gray-300 h-20 max-w-full overflow-x-auto">
					<div class="text-xs text-gray-700">Hash</div>
					{#if parsedUrl.hash}
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
		{:else}
			<div class="text-gray-500">Enter a valid URL to see the parsed components.</div>
		{/if}
	</section>
</div>
