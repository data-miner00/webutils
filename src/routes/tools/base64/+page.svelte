<script lang="ts">
	import CodeEditor from '$lib/components/custom/code-editor/code-editor.svelte';
	import { exampleEncode, exampleDecode, type Example } from '$lib/core/base64';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { EllipsisVertical, Trash2, Clipboard, Album } from '@lucide/svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Select from '$lib/components/ui/select';

	let input = $state('');
	let output = $derived('');
	let selectedMode = $state<'encode' | 'decode'>('encode');

	function base64Encode() {
		output = btoa(input);
	}

	function safeBase64Decode(str: string) {
		try {
			output = atob(str);
		} catch {
			output = 'Invalid Base64 string';
		}
	}

	function clearInput() {
		input = '';
		output = '';
	}

	function copyOutput() {
		copyText(output);
	}

	function loadExample(example: Example) {
		input = example.input;
		if (example.mode === 'decode') {
			safeBase64Decode(input);
			selectedMode = 'decode';
		} else {
			base64Encode();
			selectedMode = 'encode';
		}
	}

	let triggerContent = $derived(selectedMode === 'encode' ? 'Encode' : 'Decode');

	$effect(() => {
		if (selectedMode === 'encode') {
			base64Encode();
		} else {
			safeBase64Decode(input);
		}
	});
</script>

<div class="mb-4 flex h-screen">
	<section class="flex-1 pr-4">
		<header class="flex justify-between mb-6">
			<h1 class="text-xl font-bold block">Base64 Conversion</h1>
			<div class="flex items-center gap-4">
				<div>
					<Select.Root type="single" name="encodingMode" bind:value={selectedMode}>
						<Select.Trigger class="w-[180px]">
							{triggerContent}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Select.Label>Mode</Select.Label>
								<Select.Item value="encode" label="Encode">Encode</Select.Item><Select.Item
									value="decode"
									label="Decode"
								>
									Decode
								</Select.Item>
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>
				<ButtonGroup.Root>
					<ButtonGroup.Root>
						<Button variant="outline" onclick={() => loadExample(exampleEncode)}>Example 1</Button>
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
									<DropdownMenu.Item onclick={() => loadExample(exampleDecode)}>
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
