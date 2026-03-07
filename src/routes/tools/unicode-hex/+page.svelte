<script lang="ts">
	import { unicodeToHex, hexToUnicode } from '$lib/core/hex';
	import CodeEditor from '$lib/components/custom/code-editor/code-editor.svelte';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { EllipsisVertical, Trash2, Clipboard, Album } from '@lucide/svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Select from '$lib/components/ui/select';

	let input = $state('');
	let indentSize = $state('2');
	let mode = $state<'unicode-to-hex' | 'hex-to-unicode'>('unicode-to-hex');
	let output = $derived(mode === 'unicode-to-hex' ? unicodeToHex(input) : hexToUnicode(input));

	function clearInput() {
		input = '';
	}

	function copyOutput() {
		copyText(output);
	}

	function loadExample1() {
		input = 'Hello World';
		mode = 'unicode-to-hex';
	}

	function loadExample2() {
		input = '0x48 0x65 0x6c 0x6c 0x6f';
		mode = 'hex-to-unicode';
	}
</script>

<div class="mb-4 flex h-screen">
	<section class="flex-1 pr-4">
		<header class="flex justify-between mb-6">
			<h1 class="text-xl font-bold block">Unicode to Hex Converter</h1>
			<div class="flex items-center gap-4">
				<Select.Root type="single" name="mode" bind:value={mode}>
					<Select.Trigger>
						{mode === 'unicode-to-hex' ? 'Unicode to Hex' : 'Hex to Unicode'}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Mode</Select.Label>
							<Select.Item value="unicode-to-hex" label="Unicode to Hex">Unicode to Hex</Select.Item
							>
							<Select.Item value="hex-to-unicode" label="Hex to Unicode">Hex to Unicode</Select.Item
							>
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
		<CodeEditor class="h-[500px]!" language="text" bind:value={input} />
	</section>

	<section class="flex-1 pl-4">
		<header class="flex justify-between mb-6">
			<h2 class="text-xl font-bold block">Output</h2>

			<ButtonGroup.Root>
				<Button variant="outline" onclick={copyOutput}><Clipboard /> Copy output</Button>
			</ButtonGroup.Root>
		</header>
		<CodeEditor class="h-[500px]!" language="text" value={output} readonly />
	</section>
</div>
