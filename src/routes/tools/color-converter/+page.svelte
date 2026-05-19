<script lang="ts">
	import { Clipboard, Copy, EllipsisVertical, X } from '@lucide/svelte';

	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { colorOutput, parseColor } from '$lib/core/color';
	import { copyText } from '$lib/core/copy-to-clipboard';

	let input = $state('#1677FF');
	let mode = $state<'binary' | 'octal' | 'decimal' | 'hexadecimal' | 'base32'>('binary');

	let output = $derived(colorOutput(parseColor(input)));

	function copyOutput() {
		copyText(JSON.stringify(output, null, 2));
	}
</script>

<div class="mx-auto mt-10 max-w-xl">
	<header class="mb-20">
		<h1 class="block text-center text-xl font-bold">Color Converter</h1>
		<p class="text-muted-foreground text-center">Enter a color and get multiple formats.</p>
	</header>

	<div class="bg-background border-border w-full rounded-lg border p-6 shadow-sm">
		<header class="mb-4 flex items-center justify-end">
			<div class="flex items-center gap-2">
				<Button variant="ghost" onclick={() => (input = '#1677FF')}>Hex Example</Button>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<Button variant="ghost" aria-label="More Options"><EllipsisVertical /></Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end" class="w-44">
						<DropdownMenu.Group>
							<DropdownMenu.Item onclick={() => (input = 'hsv(125, 38.9%, 51.4%)')}
								>HSV Example</DropdownMenu.Item
							>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
				<Button variant="outline" onclick={copyOutput}><Clipboard /> Copy JSON</Button>
			</div>
		</header>

		<div class="mb-6">
			<Label for="inputNumber" class="mb-2">Select Color</Label>
			<div class="flex items-center gap-3">
				<Input
					class="h-10 w-10 rounded p-0"
					style="background-color: {output.hex};"
					type="color"
					bind:value={input}
				/>

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

		<div class="border-border border-t pt-6">
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div>
					<Label class="mb-2">RGB</Label>
					<InputGroup.Root class="mb-2">
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
				</div>

				<div>
					<Label class="mb-2">Hex</Label>
					<InputGroup.Root class="mb-2">
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
				</div>

				<div>
					<Label class="mb-2">HSL</Label>
					<InputGroup.Root class="mb-2">
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
				</div>

				<div>
					<Label class="mb-2">HSV</Label>
					<InputGroup.Root class="mb-2">
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
				</div>

				<div>
					<Label class="mb-2">HWB</Label>
					<InputGroup.Root class="mb-2">
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
				</div>

				<div>
					<Label class="mb-2">CMYK</Label>
					<InputGroup.Root class="mb-2">
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
			</div>
		</div>
	</div>
</div>
