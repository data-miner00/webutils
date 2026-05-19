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
	import {
		type UUIDVersion,
		example,
		example2,
		example3,
		example4,
		generateUUID
	} from '$lib/core/uuid';

	let quantity = $state(1);
	let version = $state<UUIDVersion>('4');
	let namespace = $state('6ba7b810-9dad-11d1-80b4-00c04fd430c8');
	let name = $state('example.com');
	let output = $state('');

	function clearInput() {
		quantity = 1;
		version = '4';
		namespace = '';
		name = '';
	}

	function copyOutput() {
		copyText(output);
	}

	function loadExample1() {
		quantity = example.quantity;
		version = example.version;
		generate();
	}

	function loadExample2() {
		quantity = example2.quantity;
		version = example2.version;
		generate();
	}

	function loadExample3() {
		quantity = example3.quantity;
		version = example3.version;
		namespace = example3.namespace!;
		name = example3.name!;
		generate();
	}

	function loadExample4() {
		quantity = example4.quantity;
		version = example4.version;
		namespace = example4.namespace!;
		name = example4.name!;
		generate();
	}

	function generate() {
		if (version === '3' || version === '5') {
			if (!namespace || !name) {
				toast.error('Namespace and Name are required for version 3 and 5 UUIDs.');
				return;
			}
		}

		output = generateUUID({ quantity, version, namespace, name }).join('\n');
	}
</script>

<div class="mx-auto mt-10 max-w-xl">
	<header class="mb-20">
		<h1 class="block text-center text-xl font-bold">UUID Generator</h1>
		<p class="text-muted-foreground text-center">
			Generate UUIDs of different versions with customizable options.
		</p>
	</header>

	<div class="flex flex-col gap-6 rounded-lg border border-solid border-gray-300 p-8">
		<div class="flex items-center justify-end gap-4">
			<ButtonGroup.Root>
				<ButtonGroup.Root>
					<Button variant="outline" onclick={loadExample1}>Example V1</Button>
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
								<DropdownMenu.Item onclick={loadExample3}>
									<Album />
									Example V3
								</DropdownMenu.Item>
								<DropdownMenu.Item onclick={loadExample2}>
									<Album />
									Example V4
								</DropdownMenu.Item>
								<DropdownMenu.Item onclick={loadExample4}>
									<Album />
									Example V5
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
								title: 'Online UUID Generator',
								url: 'https://www.uuidgenerator.net'
							},
							{
								title: 'UUID - MDN Web Docs',
								url: 'https://developer.mozilla.org/en-US/docs/Glossary/UUID'
							},
							{
								title: 'TIL: 8 versions of UUID and when to use them',
								url: 'https://ntietz.com/blog/til-uses-for-the-different-uuid-versions/'
							}
						]}
					/>
				</ButtonGroup.Root>
			</ButtonGroup.Root>
		</div>

		<div>
			<div class="mb-4">
				<Label for="uuidVersion" class="mb-3 font-bold">Version</Label>
				<Select.Root type="single" name="uuidVersion" bind:value={version}>
					<Select.Trigger class="w-full" aria-label="Select UUID Version">
						Version {version}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Version</Select.Label>
							<Select.Item value="1" label="1">Version 1</Select.Item>
							<Select.Item value="3" label="3">Version 3</Select.Item>
							<Select.Item value="4" label="4">Version 4</Select.Item>
							<Select.Item value="5" label="5">Version 5</Select.Item>
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>

			{#if version === '3' || version === '5'}
				<div class="mb-4">
					<Label for="namespace" class="mb-3 font-bold">Namespace</Label>
					<InputGroup.Root>
						<InputGroup.Input
							placeholder="Namespace"
							name="namespace"
							required
							bind:value={namespace}
						/>
						<InputGroup.Addon align="inline-end">
							<InputGroup.Button variant="ghost" onclick={() => (namespace = '')}
								><X /></InputGroup.Button
							>
						</InputGroup.Addon>
					</InputGroup.Root>
				</div>
				<div class="mb-4">
					<Label for="name" class="mb-3 font-bold">Name</Label>
					<InputGroup.Root>
						<InputGroup.Input placeholder="Name" name="name" required bind:value={name} />
						<InputGroup.Addon align="inline-end">
							<InputGroup.Button variant="ghost" onclick={() => (name = '')}
								><X /></InputGroup.Button
							>
						</InputGroup.Addon>
					</InputGroup.Root>
				</div>
			{:else}
				<div class="mb-4">
					<Label for="quantity" class="mb-3 font-bold">Quantity</Label>
					<Input
						placeholder="Quantity"
						name="quantity"
						bind:value={quantity}
						type="number"
						min="1"
					/>
				</div>
			{/if}
		</div>

		<ButtonGroup.Root class="mx-auto">
			<Button onclick={generate}><ArrowBigDown /> Generate</Button>
		</ButtonGroup.Root>

		<Textarea
			rows={10}
			disabled
			placeholder="Generated UUID will appear here."
			value={output}
			readonly
		/>

		<Button variant="outline" onclick={copyOutput}><Clipboard /> Copy output</Button>
	</div>
</div>
