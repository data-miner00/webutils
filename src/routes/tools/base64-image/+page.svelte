<script lang="ts">
	import { imageToBase64 } from '$lib/core/base64';
	import CodeEditor from '$lib/components/custom/code-editor/code-editor.svelte';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { EllipsisVertical, Trash2, Clipboard, Album } from '@lucide/svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { toPascalCase } from '$lib/core/string-utils';

	let fileInput = $state<HTMLInputElement>();
	let input = $state('');
	let mode = $state<'encode' | 'decode'>('encode');
	let output = $state('');

	async function onInputChange() {
		const fileInput = document.getElementById('fileInput') as HTMLInputElement;
		const selectedFile: File | undefined = fileInput.files?.[0];

		if (selectedFile) {
			output = await imageToBase64(selectedFile);
		} else {
			output = '';
		}
	}

	function clearInput() {
		input = '';
		output = '';
	}

	function copyOutput() {
		copyText(output);
	}

	function loadExample1() {
		input = '';
	}

	function loadExample2() {
		input = '';
	}
</script>

<div class="mb-4 flex h-screen">
	<section class="flex-1 pr-4">
		<header class="flex justify-between mb-6">
			<h1 class="text-xl font-bold block">Image to Base64</h1>
			<div class="flex items-center gap-4">
				<Select.Root type="single" name="encodingMode" bind:value={mode}>
					<Select.Trigger>
						{toPascalCase(mode)}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Mode</Select.Label>
							<Select.Item value="encode" label="Encode">Encode</Select.Item>
							<Select.Item value="decode" label="Decode">Decode</Select.Item>
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
		<div>
			<Input id="fileInput" type="file" bind:value={input} onchange={onInputChange} />
		</div>
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
