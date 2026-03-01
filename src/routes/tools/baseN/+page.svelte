<script lang="ts">
	import { BaseN } from '$lib/core/baseN';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { EllipsisVertical, Trash2, Clipboard, Album } from '@lucide/svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input/index.js';
	import { toPascalCase } from '$lib/core/string-utils';
	import Label from '$lib/components/ui/label/label.svelte';

	const base2 = new BaseN(2);
	const base8 = new BaseN(8);
	const base16 = new BaseN(16);
	const base32 = new BaseN(32);

	let input = $state('');
	let mode = $state<'binary' | 'octal' | 'decimal' | 'hexadecimal' | 'base32'>('binary');
	let decimalInput = $derived(
		!input
			? 0
			: mode === 'binary'
				? base2.decode(input)
				: mode === 'octal'
					? base8.decode(input)
					: mode === 'decimal'
						? Number(input)
						: mode === 'hexadecimal'
							? base16.decode(input)
							: base32.decode(input)
	);

	let output = $derived({
		decimalToBinary: base2.encode(Number(decimalInput)),
		decimalToOctal: base8.encode(Number(decimalInput)),
		decimalToHexadecimal: base16.encode(Number(decimalInput)),
		decimalToBase32: base32.encode(Number(decimalInput))
	});

	function clearInput() {
		input = '';
		mode = 'decimal';
	}

	function copyOutput() {
		copyText(JSON.stringify(output, null, 2));
	}

	function loadExample1() {
		input = '30';
		mode = 'decimal';
	}

	function loadExample2() {
		input = '1e';
		mode = 'hexadecimal';
	}
</script>

<div class="mb-4 flex h-screen">
	<section class="flex-1 pr-4">
		<header class="flex justify-between mb-6">
			<h1 class="text-xl font-bold block">Image to Base64</h1>
			<div class="flex items-center gap-4">
				<Select.Root type="single" name="baseType" bind:value={mode}>
					<Select.Trigger>
						{toPascalCase(mode)}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Base</Select.Label>
							<Select.Item value="binary" label="Binary">Binary</Select.Item>
							<Select.Item value="octal" label="Octal">Octal</Select.Item>
							<Select.Item value="decimal" label="Decimal">Decimal</Select.Item>
							<Select.Item value="hexadecimal" label="Hexadecimal">Hexadecimal</Select.Item>
							<Select.Item value="base32" label="Base32">Base32</Select.Item>
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
			<Input id="inputNumber" bind:value={input} />
		</div>
	</section>

	<section class="flex-1 pl-4">
		<header class="flex justify-between mb-6">
			<h2 class="text-xl font-bold block">Output</h2>

			<ButtonGroup.Root>
				<Button variant="outline" onclick={copyOutput}><Clipboard /> Copy output</Button>
			</ButtonGroup.Root>
		</header>

		<div>
			<Label for="binaryOutput" class="mb-2">Binary</Label>
			<Input id="binaryOutput" readonly class="mb-6" value={output.decimalToBinary} />

			<Label for="octalOutput" class="mb-2">Octal</Label>
			<Input id="octalOutput" readonly class="mb-6" value={output.decimalToOctal} />

			<Label for="decimalOutput" class="mb-2">Decimal</Label>
			<Input id="decimalOutput" readonly class="mb-6" value={decimalInput} />

			<Label for="hexadecimalOutput" class="mb-2">Hexadecimal</Label>
			<Input id="hexadecimalOutput" readonly class="mb-6" value={output.decimalToHexadecimal} />

			<Label for="base32Output" class="mb-2">Base32</Label>
			<Input id="base32Output" readonly class="mb-6" value={output.decimalToBase32} />
		</div>
	</section>
</div>
