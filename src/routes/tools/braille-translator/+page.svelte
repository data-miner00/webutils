<script lang="ts">
	import { Album, ArrowUpDown, Clipboard, Copy, EllipsisVertical, Trash2 } from '@lucide/svelte';

	import ReferencesSheet from '$lib/components/custom/references/references-sheet.svelte';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as InputGroup from '$lib/components/ui/input-group';
	import * as Label from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import {
		brailleExamples,
		brailleToText,
		cellToDots,
		describeCell,
		dotsToCell,
		findUnsupportedCharacters,
		isBrailleCell,
		textToBraille
	} from '$lib/core/braille';
	import { copyText } from '$lib/core/copy-to-clipboard';

	type Mode = 'text-to-braille' | 'braille-to-text';

	const modeLabels: Record<Mode, string> = {
		'text-to-braille': 'Text to Braille',
		'braille-to-text': 'Braille to Text'
	};
	// Read row by row in a 2-column grid: 1-2-3 down the left, 4-5-6 down the right, then 7 and 8
	const dotOrder = [1, 4, 2, 5, 3, 6, 7, 8];

	let mode = $state<Mode>('text-to-braille');
	let input = $state('');
	let output = $derived(mode === 'text-to-braille' ? textToBraille(input) : brailleToText(input));
	let unsupported = $derived(mode === 'text-to-braille' ? findUnsupportedCharacters(input) : []);

	let selectedDots = $state<number[]>([1]);
	let lookup = $state('');
	let cell = $derived(dotsToCell(selectedDots));
	let codePoint = $derived(cell.charCodeAt(0).toString(16).toUpperCase());
	let cellDetails = $derived([
		{ label: 'Character', value: cell },
		{ label: 'Dots', value: selectedDots.length ? selectedDots.join('-') : 'None' },
		{ label: 'Code point', value: `U+${codePoint}` },
		{ label: 'HTML entity', value: `&#x${codePoint};` }
	]);
	let meanings = $derived(describeCell(cell));
	let isLookupInvalid = $derived(lookup !== '' && ![...lookup].some(isBrailleCell));

	function useExample(text: string, exampleMode: Mode = 'text-to-braille') {
		mode = exampleMode;
		input = exampleMode === 'text-to-braille' ? text : textToBraille(text);
	}

	function swap() {
		const previousOutput = output;
		mode = mode === 'text-to-braille' ? 'braille-to-text' : 'text-to-braille';
		input = previousOutput;
	}

	function toggleDot(dot: number) {
		selectedDots = selectedDots.includes(dot)
			? selectedDots.filter((selected) => selected !== dot)
			: [...selectedDots, dot].sort((a, b) => a - b);
	}

	function inspect(value: string) {
		const firstCell = [...value].find(isBrailleCell);
		if (firstCell) {
			selectedDots = cellToDots(firstCell);
		}
	}
</script>

<div class="mx-auto my-10 max-w-xl">
	<header class="mb-20">
		<h1 class="block text-center text-xl font-bold">Braille Translator</h1>
		<p class="text-muted-foreground text-center">
			Translate text to uncontracted (Grade 1) Unified English Braille and back, or inspect a single
			braille cell.
		</p>
	</header>

	<div class="flex flex-col gap-4">
		<div class="flex justify-end">
			<div class="flex items-center gap-2">
				<Select.Root type="single" name="mode" bind:value={mode}>
					<Select.Trigger aria-label="Select mode">
						{modeLabels[mode]}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Mode</Select.Label>
							<Select.Item value="text-to-braille" label="Text to Braille">
								Text to Braille
							</Select.Item>
							<Select.Item value="braille-to-text" label="Braille to Text">
								Braille to Text
							</Select.Item>
						</Select.Group>
					</Select.Content>
				</Select.Root>
				<ButtonGroup.Root>
					<ButtonGroup.Root>
						<Button variant="outline" onclick={() => useExample(brailleExamples[0].text)}>
							Example
						</Button>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								{#snippet child({ props })}
									<Button {...props} variant="outline" aria-label="More examples">
										<EllipsisVertical />
									</Button>
								{/snippet}
							</DropdownMenu.Trigger>
							<DropdownMenu.Content align="end" class="w-56">
								<DropdownMenu.Group>
									{#each brailleExamples as example (example.title)}
										<DropdownMenu.Item onclick={() => useExample(example.text)}>
											<Album />
											{example.title}
										</DropdownMenu.Item>
									{/each}
									<DropdownMenu.Item
										onclick={() => useExample('Braille is read by touch.', 'braille-to-text')}
									>
										<Album />
										Braille to text
									</DropdownMenu.Item>
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
						<ReferencesSheet
							references={[
								{
									title: 'International Council on English Braille (UEB)',
									url: 'https://www.iceb.org'
								},
								{
									title: 'Unicode Braille Patterns chart',
									url: 'https://www.unicode.org/charts/PDF/U2800.pdf'
								},
								{
									title: 'liblouis braille translator',
									url: 'https://github.com/liblouis/liblouis'
								},
								{
									title: 'English Braille - Wikipedia',
									url: 'https://en.wikipedia.org/wiki/English_Braille'
								}
							]}
						/>
					</ButtonGroup.Root>
					<ButtonGroup.Root>
						<Button size="icon" variant="destructive" onclick={() => (input = '')}>
							<Trash2 />
						</Button>
					</ButtonGroup.Root>
				</ButtonGroup.Root>
			</div>
		</div>

		<div>
			<Label.Root for="braille-input" class="mb-3 font-bold">Input</Label.Root>
			<Textarea
				id="braille-input"
				rows={6}
				class={mode === 'braille-to-text' ? 'text-2xl md:text-2xl' : ''}
				placeholder={mode === 'text-to-braille'
					? 'Enter text to translate to braille.'
					: 'Paste Unicode braille, e.g. ⠠⠓⠑⠇⠇⠕'}
				bind:value={input}
			/>
			{#if unsupported.length}
				<p class="text-destructive mt-2 text-sm">
					Not supported, kept as is: {unsupported.join(' ')}
				</p>
			{/if}
		</div>

		<div class="flex justify-center">
			<Button variant="outline" size="sm" disabled={!output} onclick={swap}>
				<ArrowUpDown /> Swap input and output
			</Button>
		</div>

		<div>
			<Label.Root for="braille-output" class="mb-3 font-bold">Output</Label.Root>
			<Textarea
				id="braille-output"
				rows={6}
				class={mode === 'text-to-braille' ? 'text-2xl md:text-2xl' : ''}
				placeholder="The translation will appear here."
				readonly
				value={output}
			/>
		</div>

		<Button variant="outline" disabled={!output} onclick={() => copyText(output)}>
			<Clipboard /> Copy output
		</Button>
	</div>

	<section class="mt-16 flex flex-col gap-4">
		<div>
			<h2 class="text-lg font-semibold">Cell Inspector</h2>
			<p class="text-muted-foreground text-sm">
				Toggle dots or paste a braille character to see its code point and meaning. Dots 7 and 8 are
				only used in 8-dot computer braille.
			</p>
		</div>

		<div class="border-ring/50 flex flex-col gap-6 rounded-lg border border-solid p-4 sm:flex-row">
			<div class="grid grid-cols-2 gap-2 self-center">
				{#each dotOrder as dot (dot)}
					<Button
						variant={selectedDots.includes(dot) ? 'default' : 'outline'}
						size="icon-lg"
						class="rounded-full {dot > 6 ? 'border-dashed' : ''}"
						aria-label="Dot {dot}"
						aria-pressed={selectedDots.includes(dot)}
						onclick={() => toggleDot(dot)}
					>
						{dot}
					</Button>
				{/each}
			</div>

			<div class="flex flex-1 flex-col gap-4">
				<p class="text-center text-7xl leading-none sm:text-left">{cell}</p>

				<dl class="grid grid-cols-[auto_1fr_auto] items-center gap-x-4 text-sm">
					{#each cellDetails as detail (detail.label)}
						<dt class="text-muted-foreground">{detail.label}</dt>
						<dd class="font-mono break-all">{detail.value}</dd>
						<dd>
							<Button
								variant="ghost"
								size="icon-sm"
								aria-label="Copy {detail.label.toLowerCase()}"
								title="Copy {detail.label.toLowerCase()}"
								onclick={() => copyText(detail.value)}
							>
								<Copy />
							</Button>
						</dd>
					{/each}
				</dl>

				<div>
					<p class="text-sm font-medium">Meaning in uncontracted UEB</p>
					{#if meanings.length}
						<ul class="text-muted-foreground list-disc ps-5 text-sm">
							{#each meanings as meaning (meaning)}
								<li>{meaning}</li>
							{/each}
						</ul>
					{:else}
						<p class="text-muted-foreground text-sm">No meaning on its own.</p>
					{/if}
				</div>
			</div>
		</div>

		<div>
			<InputGroup.Root>
				<InputGroup.Input
					id="braille-lookup"
					placeholder="Paste a braille character, e.g. ⠃"
					autocomplete="off"
					bind:value={lookup}
					oninput={(event) => inspect(event.currentTarget.value)}
				/>
				<InputGroup.Addon align="block-start">
					<Label.Root for="braille-lookup" class="text-foreground">Look up a cell</Label.Root>
				</InputGroup.Addon>
			</InputGroup.Root>
			{#if isLookupInvalid}
				<p class="text-destructive mt-2 text-sm">No braille character found.</p>
			{/if}
		</div>
	</section>
</div>
