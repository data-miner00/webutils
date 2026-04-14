<script lang="ts">
	import { Album, Clipboard, EllipsisVertical, Trash2 } from '@lucide/svelte';

	import CodeEditor from '$lib/components/custom/code-editor/code-editor.svelte';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Select from '$lib/components/ui/select';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import {
		exampleFormatJson,
		exampleFormatJson2,
		exampleMinifyJson,
		formatJson,
		minifyJson
	} from '$lib/core/format-json';

	let input = $state('');
	let indentSize = $state('2');
	let mode = $state<'format' | 'minify'>('format');
	let output = $derived(
		mode == 'format' ? formatJson(input, { indentSize: Number(indentSize) }) : minifyJson(input)
	);
	let modeTriggerContent = $derived(mode === 'format' ? 'Format' : 'Minify');

	function clearInput() {
		input = '';
	}

	function copyOutput() {
		copyText(output);
	}

	function loadExample1() {
		input = exampleFormatJson.json;
		mode = exampleFormatJson.mode;
	}

	function loadExample2() {
		input = exampleFormatJson2.json;
		mode = exampleFormatJson2.mode;
	}

	function loadExample3() {
		input = exampleMinifyJson.json;
		mode = exampleMinifyJson.mode;
	}
</script>

<div class="grid h-full grid-cols-2 gap-4 px-4 py-6">
	<section class="flex flex-1 flex-col overflow-hidden">
		<header class="mb-6 flex justify-between">
			<h1 class="block text-xl font-bold">Format JSON</h1>
			<div class="flex items-center gap-4">
				<Select.Root type="single" name="encodingMode" bind:value={mode}>
					<Select.Trigger>
						{modeTriggerContent}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Mode</Select.Label>
							<Select.Item value="format" label="format">Format</Select.Item>
							<Select.Item value="minify" label="minify">Minify</Select.Item>
						</Select.Group>
					</Select.Content>
				</Select.Root>
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
									<DropdownMenu.Item onclick={loadExample3}>
										<Album />
										Example 3
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
		<CodeEditor class="flex-1" language="json" bind:value={input} />
	</section>

	<section class="flex flex-1 flex-col overflow-hidden">
		<header class="mb-6 flex justify-between">
			<h2 class="block text-xl font-bold">Output</h2>

			<ButtonGroup.Root>
				<Button variant="outline" onclick={copyOutput}><Clipboard /> Copy output</Button>
			</ButtonGroup.Root>
		</header>
		<CodeEditor class="flex-1" language="json" value={output} readonly />
	</section>
</div>
