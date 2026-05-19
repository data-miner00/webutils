<script lang="ts">
	import { Album, ArrowUpRightIcon, EllipsisVertical, FileTextIcon, Trash2 } from '@lucide/svelte';

	import CodeEditor from '$lib/components/custom/code-editor/code-editor.svelte';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Empty from '$lib/components/ui/empty/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	import { exampleHtml, exampleHtml2 } from './examples';

	let input = $state('');

	function clearInput() {
		input = '';
	}

	function loadExample1() {
		input = exampleHtml;
	}

	function loadExample2() {
		input = exampleHtml2;
	}
</script>

<div class="h-full grid-cols-2 gap-4 px-4 py-6 md:grid">
	<section class="mb-6 flex flex-1 flex-col overflow-hidden md:mb-0">
		<header class="mb-6 justify-between md:flex">
			<div class="mb-4 flex items-center gap-4 md:mb-0">
				<Sidebar.Trigger class="md:hidden" />
				<h1 class="block text-xl font-bold">View HTML</h1>
			</div>
			<div class="flex items-center gap-4">
				<ButtonGroup.Root>
					<ButtonGroup.Root>
						<Button variant="outline" onclick={loadExample1}>Example 1</Button>
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
									<DropdownMenu.Item onclick={loadExample2}>
										<Album />
										Example 2
									</DropdownMenu.Item>
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</ButtonGroup.Root>
					<ButtonGroup.Root>
						<Button size="icon" variant="destructive" onclick={clearInput}><Trash2 /></Button>
					</ButtonGroup.Root>
				</ButtonGroup.Root>
			</div>
		</header>
		<CodeEditor class="flex-1" language="html" bind:value={input} />
	</section>

	<section class="flex flex-1 flex-col overflow-hidden">
		<header class="mb-6 flex justify-between">
			<h2 class="block text-xl font-bold">Output</h2>
		</header>

		{#if input.trim() === ''}
			<Empty.Root class="border border-solid border-gray-300">
				<Empty.Header>
					<Empty.Media variant="icon">
						<FileTextIcon />
					</Empty.Media>
					<Empty.Title>No HTML Input</Empty.Title>
					<Empty.Description>
						You haven't entered any HTML yet. Get started by entering some HTML code.
					</Empty.Description>
				</Empty.Header>
				<Empty.Content>
					<div class="flex gap-2">
						<Button onclick={loadExample1}>Load Example 1</Button>
						<Button variant="outline" onclick={loadExample2}>Load Example 2</Button>
					</div>
				</Empty.Content>
				<Button variant="link" class="text-muted-foreground" size="sm">
					<a href="#/">
						Learn More <ArrowUpRightIcon class="inline" />
					</a>
				</Button>
			</Empty.Root>
		{:else}
			<iframe
				title="View for HTML input"
				class="w-full flex-1 border border-solid border-gray-300"
				srcdoc={input}
			></iframe>
		{/if}
	</section>
</div>
