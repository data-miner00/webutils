<script lang="ts">
	import { Album, ArrowBigDown, Clipboard, Copy, EllipsisVertical, X } from '@lucide/svelte';

	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Select from '$lib/components/ui/select';
	import { BaseN } from '$lib/core/baseN';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import { toPascalCase } from '$lib/core/string-utils';

	const base2 = new BaseN(2);
	const base8 = new BaseN(8);
	const base16 = new BaseN(16);
	const base32 = new BaseN(32);

	let input = $state('1001');
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

	function copyOutput() {
		copyText(JSON.stringify(output, null, 2));
	}

	function loadBinaryExample() {
		input = '1001';
		mode = 'binary';
	}

	function loadOctalExample() {
		input = '154';
		mode = 'octal';
	}

	function loadDecimalExample() {
		input = '1234';
		mode = 'decimal';
	}

	function loadHexadecimalExample() {
		input = '1A3F';
		mode = 'hexadecimal';
	}

	function loadBase32Example() {
		input = 'JBS1F3DP';
		mode = 'base32';
	}
</script>

<div class="mx-auto mt-10 max-w-xl">
	<header class="mb-20">
		<h1 class="block text-center text-xl font-bold">Base Number Conversion</h1>
		<p class="text-muted-foreground text-center">Convert numbers between different bases.</p>
	</header>

	<div class="flex flex-col gap-6">
		<div class="flex justify-end">
			<div class="flex items-center gap-2">
				<ButtonGroup.Root>
					<ButtonGroup.Root>
						<Button variant="outline" onclick={loadBinaryExample}>Binary Example</Button>
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
									<DropdownMenu.Item onclick={loadOctalExample}>
										<Album />
										Octal Example
									</DropdownMenu.Item>
									<DropdownMenu.Item onclick={loadDecimalExample}>
										<Album />
										Decimal Example
									</DropdownMenu.Item>
									<DropdownMenu.Item onclick={loadHexadecimalExample}>
										<Album />
										Hexadecimal Example
									</DropdownMenu.Item>
									<DropdownMenu.Item onclick={loadBase32Example}>
										<Album />
										Base32 Example
									</DropdownMenu.Item>
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</ButtonGroup.Root>
				</ButtonGroup.Root>
			</div>
		</div>
		<div>
			<Label for="base" class="mb-2">Base</Label>
			<Select.Root type="single" name="baseType" bind:value={mode}>
				<Select.Trigger class="mb-6 w-full">
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

			<Label for="inputNumber" class="mb-2">Input Number</Label>
			<InputGroup.Root>
				<InputGroup.Input id="inputNumber" bind:value={input} />
				{#if input}
					<InputGroup.Addon align="inline-end">
						<InputGroup.Button
							aria-label="Clear"
							title="Clear input"
							size="icon-xs"
							onclick={() => (input = '')}
						>
							<X />
						</InputGroup.Button>
					</InputGroup.Addon>
				{/if}
			</InputGroup.Root>
		</div>

		<div class="mx-auto">
			<ArrowBigDown />
		</div>

		<div class="flex grid-cols-2 flex-col gap-2 md:grid">
			<div>
				<Label for="binaryOutput" class="mb-2">Binary</Label>

				<InputGroup.Root class="mb-6">
					<InputGroup.Input value={output.decimalToBinary} readonly />
					<InputGroup.Addon align="inline-end">
						<InputGroup.Button
							aria-label="Copy"
							title="Copy"
							size="icon-xs"
							onclick={() => copyText(output.decimalToBinary)}
						>
							<Copy />
						</InputGroup.Button>
					</InputGroup.Addon>
				</InputGroup.Root>
			</div>

			<div>
				<Label for="octalOutput" class="mb-2">Octal</Label>

				<InputGroup.Root class="mb-6">
					<InputGroup.Input value={output.decimalToOctal} readonly />
					<InputGroup.Addon align="inline-end">
						<InputGroup.Button
							aria-label="Copy"
							title="Copy"
							size="icon-xs"
							onclick={() => copyText(output.decimalToOctal)}
						>
							<Copy />
						</InputGroup.Button>
					</InputGroup.Addon>
				</InputGroup.Root>
			</div>

			<div>
				<Label for="decimalOutput" class="mb-2">Decimal</Label>
				<InputGroup.Root class="mb-6">
					<InputGroup.Input value={decimalInput} readonly />
					<InputGroup.Addon align="inline-end">
						<InputGroup.Button
							aria-label="Copy"
							title="Copy"
							size="icon-xs"
							onclick={() => copyText(decimalInput.toString())}
						>
							<Copy />
						</InputGroup.Button>
					</InputGroup.Addon>
				</InputGroup.Root>
			</div>

			<div>
				<Label for="hexadecimalOutput" class="mb-2">Hexadecimal</Label>
				<InputGroup.Root class="mb-6">
					<InputGroup.Input value={output.decimalToHexadecimal} readonly />
					<InputGroup.Addon align="inline-end">
						<InputGroup.Button
							aria-label="Copy"
							title="Copy"
							size="icon-xs"
							onclick={() => copyText(output.decimalToHexadecimal)}
						>
							<Copy />
						</InputGroup.Button>
					</InputGroup.Addon>
				</InputGroup.Root>
			</div>

			<div>
				<Label for="base32Output" class="mb-2">Base32</Label>
				<InputGroup.Root class="mb-6">
					<InputGroup.Input value={output.decimalToBase32} readonly />
					<InputGroup.Addon align="inline-end">
						<InputGroup.Button
							aria-label="Copy"
							title="Copy"
							size="icon-xs"
							onclick={() => copyText(output.decimalToBase32)}
						>
							<Copy />
						</InputGroup.Button>
					</InputGroup.Addon>
				</InputGroup.Root>
			</div>
		</div>

		<ButtonGroup.Root class="ml-auto">
			<Button variant="outline" onclick={copyOutput}><Clipboard /> Copy as JSON</Button>
		</ButtonGroup.Root>
	</div>
</div>
