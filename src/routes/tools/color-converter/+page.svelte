<script lang="ts">
	import { Album, Clipboard, Copy, EllipsisVertical, X } from '@lucide/svelte';

	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Select from '$lib/components/ui/select';
	import { colorOutput, parseColor } from '$lib/core/color';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import { toPascalCase } from '$lib/core/string-utils';

	let input = $state('#1677FF');
	let mode = $state<'binary' | 'octal' | 'decimal' | 'hexadecimal' | 'base32'>('binary');

	let output = $derived(colorOutput(parseColor(input)));

	function copyOutput() {
		copyText(JSON.stringify(output, null, 2));
	}
</script>

<div class="grid h-full grid-cols-2 gap-4 px-4 py-6">
	<section class="flex flex-1 flex-col overflow-hidden">
		<header class="mb-6 flex justify-between">
			<h1 class="block text-xl font-bold">Color Converter</h1>
			<div class="flex items-center gap-4">
				<ButtonGroup.Root>
					<ButtonGroup.Root>
						<Button variant="outline" onclick={() => (input = '#1677FF')}
							>Hexadecimal Example</Button
						>
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
									<DropdownMenu.Item onclick={() => (input = 'hsv(125, 38.9%, 51.4%)')}>
										<Album />
										HSV Example
									</DropdownMenu.Item>
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</ButtonGroup.Root>
				</ButtonGroup.Root>
			</div>
		</header>
		<div>
			<Label for="inputNumber" class="mb-2">Select Color</Label>

			<div class="mb-6 flex items-center gap-2">
				<div>
					<Input
						class="h-8 w-8 cursor-pointer"
						style="background-color: {output.hex};"
						type="color"
						bind:value={input}
					/>
				</div>

				<div class="flex-1">
					<InputGroup.Root>
						<InputGroup.Input id="inputNumber" bind:value={input} />
						{#if input != '#000000'}
							<InputGroup.Addon align="inline-end">
								<InputGroup.Button
									aria-label="Reset"
									title="Reset input"
									size="icon-xs"
									onclick={() => (input = '#000000')}
								>
									<X />
								</InputGroup.Button>
							</InputGroup.Addon>
						{/if}
					</InputGroup.Root>
				</div>
			</div>
		</div>
	</section>

	<section class="flex flex-1 flex-col overflow-hidden">
		<header class="mb-6 flex justify-between">
			<h2 class="block text-xl font-bold">Output</h2>

			<ButtonGroup.Root>
				<Button variant="outline" onclick={copyOutput}><Clipboard /> Copy as JSON</Button>
			</ButtonGroup.Root>
		</header>

		<div>
			<Label for="rgbOutput" class="mb-2">RGB</Label>

			<InputGroup.Root class="mb-6">
				<InputGroup.Input value={output.rgb} readonly />
				<InputGroup.Addon align="inline-end">
					<InputGroup.Button
						aria-label="Copy"
						title="Copy"
						size="icon-xs"
						onclick={() => copyText(output.rgb)}
					>
						<Copy />
					</InputGroup.Button>
				</InputGroup.Addon>
			</InputGroup.Root>

			<Label for="hexOutput" class="mb-2">Hex</Label>

			<InputGroup.Root class="mb-6">
				<InputGroup.Input value={output.hex} readonly />
				<InputGroup.Addon align="inline-end">
					<InputGroup.Button
						aria-label="Copy"
						title="Copy"
						size="icon-xs"
						onclick={() => copyText(output.hex)}
					>
						<Copy />
					</InputGroup.Button>
				</InputGroup.Addon>
			</InputGroup.Root>

			<Label for="hslOutput" class="mb-2">HSL</Label>
			<InputGroup.Root class="mb-6">
				<InputGroup.Input value={output.hsl} readonly />
				<InputGroup.Addon align="inline-end">
					<InputGroup.Button
						aria-label="Copy"
						title="Copy"
						size="icon-xs"
						onclick={() => copyText(output.hsl)}
					>
						<Copy />
					</InputGroup.Button>
				</InputGroup.Addon>
			</InputGroup.Root>

			<Label for="hsvOutput" class="mb-2">HSV</Label>
			<InputGroup.Root class="mb-6">
				<InputGroup.Input value={output.hsv} readonly />
				<InputGroup.Addon align="inline-end">
					<InputGroup.Button
						aria-label="Copy"
						title="Copy"
						size="icon-xs"
						onclick={() => copyText(output.hsv)}
					>
						<Copy />
					</InputGroup.Button>
				</InputGroup.Addon>
			</InputGroup.Root>

			<Label for="hwbOutput" class="mb-2">HWB</Label>
			<InputGroup.Root class="mb-6">
				<InputGroup.Input value={output.hwb} readonly />
				<InputGroup.Addon align="inline-end">
					<InputGroup.Button
						aria-label="Copy"
						title="Copy"
						size="icon-xs"
						onclick={() => copyText(output.hwb)}
					>
						<Copy />
					</InputGroup.Button>
				</InputGroup.Addon>
			</InputGroup.Root>

			<Label for="cmykOutput" class="mb-2">CMYK</Label>
			<InputGroup.Root class="mb-6">
				<InputGroup.Input value={output.cmyk} readonly />
				<InputGroup.Addon align="inline-end">
					<InputGroup.Button
						aria-label="Copy"
						title="Copy"
						size="icon-xs"
						onclick={() => copyText(output.cmyk)}
					>
						<Copy />
					</InputGroup.Button>
				</InputGroup.Addon>
			</InputGroup.Root>
		</div>
	</section>
</div>
