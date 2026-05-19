<script lang="ts">
	import { Album, Clipboard, EllipsisVertical, Trash2 } from '@lucide/svelte';

	import CodeEditor from '$lib/components/custom/code-editor/code-editor.svelte';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Select from '$lib/components/ui/select';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import { exampleFormatHtml, exampleFormatHtml2, formatHtml } from '$lib/core/format-html';

	let input = $state('');
	let indentSize = $state('2');
	let output = $derived(formatHtml(input, { indentSize: Number(indentSize) }));

	function clearInput() {
		input = '';
	}

	function copyOutput() {
		copyText(output);
	}

	function loadExample1() {
		input = exampleFormatHtml;
	}

	function loadExample2() {
		input = exampleFormatHtml2;
	}
</script>

<div class="h-full grid-cols-2 gap-4 px-4 py-6 md:grid">
	<section class="mb-6 flex flex-1 flex-col overflow-hidden md:mb-0">
		<header class="mb-6 justify-between md:flex">
			<div class="mb-4 flex items-center gap-4 md:mb-0">
				<Sidebar.Trigger class="md:hidden" />
				<h1 class="block text-xl font-bold">Format HTML</h1>
			</div>
			<div class="flex items-center gap-4">
				<Select.Root type="single" name="indentSize" bind:value={indentSize}>
					<Select.Trigger>
						{indentSize}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Spacing</Select.Label>
							<Select.Item value="2" label="2">2</Select.Item>
							<Select.Item value="4" label="4">4</Select.Item>
						</Select.Group>
					</Select.Content>
				</Select.Root>
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

			<ButtonGroup.Root>
				<Button variant="outline" onclick={copyOutput}><Clipboard /> Copy output</Button>
			</ButtonGroup.Root>
		</header>
		<CodeEditor class="flex-1" language="html" value={output} readonly />
	</section>
</div>
