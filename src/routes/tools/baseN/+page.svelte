<script lang="ts">
	import { Clipboard, Copy, X } from '@lucide/svelte';

	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Select from '$lib/components/ui/select';
	import { BaseN } from '$lib/core/baseN';
	import { copyText } from '$lib/core/copy-to-clipboard';

	type Mode = 'binary' | 'octal' | 'decimal' | 'hexadecimal' | 'base32';

	const base2 = new BaseN(2);
	const base8 = new BaseN(8);
	const base16 = new BaseN(16);
	const base32 = new BaseN(32);

	const allModes: Mode[] = ['binary', 'octal', 'decimal', 'hexadecimal', 'base32'];

	const modeLabels: Record<Mode, string> = {
		binary: 'Binary',
		octal: 'Octal',
		decimal: 'Decimal',
		hexadecimal: 'Hexadecimal',
		base32: 'Base32'
	};

	const exampleLabels: Record<Mode, string> = {
		binary: 'Binary',
		octal: 'Octal',
		decimal: 'Decimal',
		hexadecimal: 'Hex',
		base32: 'Base32'
	};

	const examples: Record<Mode, string> = {
		binary: '1001',
		octal: '154',
		decimal: '1234',
		hexadecimal: '1A3F',
		base32: 'JBS1F3DP'
	};

	let input = $state('1001');
	let mode = $state<Mode>('binary');

	function decodeInput(value: string, currentMode: Mode): number | null {
		if (!value) return 0;
		try {
			switch (currentMode) {
				case 'binary':
					return base2.decode(value);
				case 'octal':
					return base8.decode(value);
				case 'decimal':
					if (!/^\d+$/.test(value)) throw new Error('Invalid decimal number');
					return Number(value);
				case 'hexadecimal':
					return base16.decode(value);
				case 'base32':
					return base32.decode(value);
			}
		} catch {
			return null;
		}
	}

	let decimalInput = $derived(decodeInput(input, mode));
	let isValid = $derived(decimalInput !== null);

	let output = $derived<Record<Mode, string>>(
		decimalInput === null
			? { binary: '', octal: '', decimal: '', hexadecimal: '', base32: '' }
			: {
					binary: base2.encode(decimalInput),
					octal: base8.encode(decimalInput),
					decimal: decimalInput.toString(),
					hexadecimal: base16.encode(decimalInput),
					base32: base32.encode(decimalInput)
				}
	);

	let visibleOutputModes = $derived(allModes.filter((m) => m !== mode));

	function copyOutput() {
		if (isValid) copyText(JSON.stringify(output, null, 2));
	}

	function loadExample(exampleMode: Mode) {
		input = examples[exampleMode];
		mode = exampleMode;
	}
</script>

<div class="mx-auto mt-10 max-w-xl">
	<header class="mb-20">
		<h1 class="block text-center text-xl font-bold">Base Number Conversion</h1>
		<p class="text-muted-foreground text-center">Convert numbers between different bases.</p>
	</header>

	<div class="bg-background border-border w-full rounded-lg border p-6 shadow-sm">
		<header class="mb-4 flex flex-wrap items-center justify-between gap-2">
			<ButtonGroup.Root>
				{#each allModes as mode (mode)}
					<Button variant="ghost" size="sm" onclick={() => loadExample(mode)}>
						{exampleLabels[mode]}
					</Button>
				{/each}
			</ButtonGroup.Root>
			<Button variant="outline" size="sm" onclick={copyOutput} disabled={!isValid}>
				<Clipboard /> Copy JSON
			</Button>
		</header>

		<div class="mb-6">
			<Label for="inputNumber" class="mb-2">Input Number</Label>
			<div class="flex items-center gap-3">
				<Select.Root type="single" name="baseType" bind:value={mode}>
					<Select.Trigger class="w-40 shrink-0">
						{modeLabels[mode]}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Base</Select.Label>
							{#each allModes as mode (mode)}
								<Select.Item value={mode} label={modeLabels[mode]}>{modeLabels[mode]}</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>

				<div class="flex-1">
					<InputGroup.Root>
						<InputGroup.Input id="inputNumber" bind:value={input} aria-invalid={!isValid} />
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
			</div>
			{#if !isValid}
				<p class="text-destructive mt-2 text-sm">
					"{input}" is not a valid {modeLabels[mode]} number.
				</p>
			{/if}
		</div>

		<div class="border-border border-t pt-6">
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				{#each visibleOutputModes as mode (mode)}
					<div>
						<Label class="mb-2">{modeLabels[mode]}</Label>
						<InputGroup.Root>
							<InputGroup.Input value={output[mode]} placeholder="—" disabled />
							<InputGroup.Addon align="inline-end">
								<InputGroup.Button
									aria-label="Copy"
									title="Copy"
									size="icon-xs"
									disabled={!output[mode]}
									onclick={() => copyText(output[mode])}
								>
									<Copy />
								</InputGroup.Button>
							</InputGroup.Addon>
						</InputGroup.Root>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
