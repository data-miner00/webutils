<script lang="ts">
	import { formatJs, exampleFormatJs, exampleFormatJs2, minifyJs } from '$lib/core/format-js';
	import CodeEditor from '$lib/components/custom/code-editor/code-editor.svelte';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { EllipsisVertical, Trash2, Clipboard, Album } from '@lucide/svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Select from '$lib/components/ui/select';

	let input = $state('');
	let indentSize = $state('2');
	let mode = $state<'format' | 'minify'>('format');
	let output = $state('');
	let modeTriggerContent = $derived(mode === 'format' ? 'Format' : 'Minify');

	$effect(() => {
		if (mode === 'minify') {
			minifyJs(input).then((res) => (output = res));
		} else {
			output = formatJs(input, { indentSize: Number(indentSize) });
		}
	});

	function clearInput() {
		input = '';
	}

	function copyOutput() {
		copyText(output);
	}

	function loadExample1() {
		input = exampleFormatJs;
	}

	function loadExample2() {
		input = exampleFormatJs2;
	}
</script>

<div class="mb-4 flex h-screen">
	<section class="flex-1 pr-4">
		<header class="flex justify-between mb-6">
			<h1 class="text-xl font-bold block">Format JavaScript</h1>
			<div class="flex items-center gap-4">
				<Select.Root type="single" name="encodingMode" bind:value={mode}>
					<Select.Trigger>
						{modeTriggerContent}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Mode</Select.Label>
							<Select.Item value="format" label="Format">Format</Select.Item>
							<Select.Item value="minify" label="Minify">Minify</Select.Item>
						</Select.Group>
					</Select.Content>
				</Select.Root>
				<Select.Root type="single" name="encodingMode" bind:value={indentSize}>
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
		<CodeEditor class="h-[500px]!" language="javascript" bind:value={input} />
	</section>

	<section class="flex-1 pl-4">
		<header class="flex justify-between mb-6">
			<h2 class="text-xl font-bold block">Output</h2>

			<ButtonGroup.Root>
				<Button variant="outline" onclick={copyOutput}><Clipboard /> Copy output</Button>
			</ButtonGroup.Root>
		</header>
		<CodeEditor class="h-[500px]!" language="javascript" value={output} readonly />
	</section>
</div>
