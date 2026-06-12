<script lang="ts">
	import { Album, Clipboard, EllipsisVertical, Trash2Icon } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	import ReferencesSheet from '$lib/components/custom/references/references-sheet.svelte';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import { morseToText, textToMorse } from '$lib/core/morse-code';

	let mode = $state<'text-to-morse' | 'morse-to-text'>('text-to-morse');
	let input = $state('');
	let output = $derived.by(() => {
		if (!input.trim()) return '';
		if (mode === 'text-to-morse') {
			return textToMorse(input);
		} else {
			return morseToText(input);
		}
	});

	function copyOutput() {
		if (!output) {
			toast.error('Nothing to copy!');
			return;
		}
		copyText(output);
	}

	function example1() {
		mode = 'text-to-morse';
		input = 'Hello World';
	}

	function example2() {
		mode = 'morse-to-text';
		input = '.... . .-.. .-.. --- / .-- --- .-. .-.. -..';
	}
</script>

<div class="mx-auto mt-10 max-w-xl">
	<header class="mb-20">
		<h1 class="block text-center text-xl font-bold">Morse Code Converter</h1>
		<p class="text-muted-foreground text-center">
			Convert text to Morse code and vice versa. Separate Morse code letters with spaces and words
			with slashes (/).
		</p>
	</header>

	<div class="flex flex-col gap-6 rounded-lg border border-solid border-gray-300 p-8">
		<div class="flex items-center justify-end gap-4">
			<ButtonGroup.Root>
				<ButtonGroup.Root>
					<Button variant="outline" onclick={example1}>Example 1</Button>
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
								<DropdownMenu.Item onclick={example2}>
									<Album />
									Example 2
								</DropdownMenu.Item>
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</ButtonGroup.Root>
				<ButtonGroup.Root>
					<Button size="icon" variant="outline" onclick={() => (input = '')}><Trash2Icon /></Button>
				</ButtonGroup.Root>

				<ButtonGroup.Root>
					<ReferencesSheet
						references={[
							{
								title: 'Morse Code Translator',
								url: 'https://morsecode.world/international/translator.html'
							}
						]}
					/>
				</ButtonGroup.Root>
			</ButtonGroup.Root>
		</div>

		<div>
			<div class="mb-4">
				<Label for="mode" class="mb-3 font-bold">Mode</Label>
				<Select.Root type="single" name="mode" bind:value={mode}>
					<Select.Trigger class="w-full" aria-label="Select Mode">
						{mode === 'text-to-morse' ? 'Text to Morse' : 'Morse to Text'}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Mode</Select.Label>
							<Select.Item value="text-to-morse" label="Text to Morse">Text to Morse</Select.Item>
							<Select.Item value="morse-to-text" label="Morse to Text">Morse to Text</Select.Item>
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>

			<Label for="input" class="mb-3 font-bold">Input</Label>
			<Textarea rows={10} name="input" placeholder="Enter text or Morse code here." value={input} />
		</div>

		<div>
			<Label for="output" class="mb-3 font-bold">Output</Label>
			<Textarea
				rows={10}
				name="output"
				disabled
				placeholder="Generated output will appear here."
				bind:value={output}
				readonly
			/>
		</div>

		<Button variant="outline" onclick={copyOutput}><Clipboard /> Copy output</Button>
	</div>
</div>
