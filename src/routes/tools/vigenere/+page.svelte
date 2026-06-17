<script lang="ts">
	import { Album, ArrowBigDown, Clipboard, EllipsisVertical, RotateCcw, X } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	import ReferencesSheet from '$lib/components/custom/references/references-sheet.svelte';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import { vigenereCipher, vigenereDecipher } from '$lib/core/vigenere-cipher';

	let input = $state('');
	let key = $state('');
	let mode = $state<'encrypt' | 'decrypt'>('encrypt');
	let output = $state('');

	function generate() {
		if (input.length !== key.length) {
			toast.error('Input and key must be of the same length.');
			return;
		}

		if (mode === 'encrypt') {
			output = vigenereCipher(input, key);
		} else {
			output = vigenereDecipher(input, key);
		}
	}

	function copyOutput() {
		copyText(output);
	}

	function clearInput() {
		input = '';
		key = '';
		output = '';
		mode = 'encrypt';
	}

	function loadExample1() {
		input = 'ATTACKATDAWN';
		key = 'LEMONLEMONLE';
		mode = 'encrypt';
		generate();
	}

	function loadExample2() {
		input = 'LXFOPVEFRNHR';
		key = 'LEMONLEMONLE';
		mode = 'decrypt';
		generate();
	}
</script>

<div class="mx-auto mt-10 max-w-xl">
	<header class="mb-20">
		<h1 class="block text-center text-xl font-bold">Vigenère Cipher</h1>
		<p class="text-muted-foreground text-center">
			Encrypt and decrypt messages using the Vigenère cipher.
		</p>
	</header>

	<div class="flex flex-col gap-6 rounded-lg border border-solid border-gray-300 p-8">
		<div class="flex items-center justify-end gap-4">
			<ButtonGroup.Root>
				<ButtonGroup.Root>
					<Button variant="outline" onclick={loadExample1}>Encrypt Example</Button>
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
									Decrypt Example
								</DropdownMenu.Item>
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</ButtonGroup.Root>
				<ButtonGroup.Root>
					<Button size="icon" variant="outline" onclick={clearInput}><RotateCcw /></Button>
				</ButtonGroup.Root>

				<ButtonGroup.Root>
					<ReferencesSheet
						references={[
							{
								title: 'Vigenère Cipher - Cryptii',
								url: 'https://cryptii.com/pipes/vigenere-cipher/'
							},
							{
								title: 'Vigenère Cipher - Wikipedia',
								url: 'https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher'
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
					<Select.Trigger class="w-full" aria-label="Select UUID Version">
						{mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Mode</Select.Label>
							<Select.Item value="encrypt" label="Encrypt">Encrypt</Select.Item>
							<Select.Item value="decrypt" label="Decrypt">Decrypt</Select.Item>
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>

			<div class="mb-4">
				<Label for="input" class="mb-3 font-bold">Input</Label>
				<InputGroup.Root>
					<InputGroup.Input placeholder="Input" name="input" required bind:value={input} />
					<InputGroup.Addon align="inline-end">
						<InputGroup.Button variant="ghost" onclick={() => (input = '')}><X /></InputGroup.Button
						>
					</InputGroup.Addon>
				</InputGroup.Root>
			</div>
			<div class="mb-4">
				<Label for="key" class="mb-3 font-bold">Key</Label>
				<InputGroup.Root>
					<InputGroup.Input placeholder="Key" name="key" required bind:value={key} />
					<InputGroup.Addon align="inline-end">
						<InputGroup.Button variant="ghost" onclick={() => (key = '')}><X /></InputGroup.Button>
					</InputGroup.Addon>
				</InputGroup.Root>
			</div>
		</div>

		<ButtonGroup.Root class="mx-auto">
			<Button onclick={generate}><ArrowBigDown /> Generate</Button>
		</ButtonGroup.Root>

		<Textarea rows={10} disabled placeholder="Output will appear here." value={output} readonly />

		<Button variant="outline" onclick={copyOutput}><Clipboard /> Copy output</Button>
	</div>
</div>
