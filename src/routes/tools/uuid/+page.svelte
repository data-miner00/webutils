<script lang="ts">
	import CodeEditor from '$lib/components/custom/code-editor/code-editor.svelte';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { EllipsisVertical, Trash2, Clipboard, Album, ArrowBigRight } from '@lucide/svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Select from '$lib/components/ui/select';
	import {
		generateUUID,
		type UUIDVersion,
		example,
		example2,
		example3,
		example4
	} from '$lib/core/uuid';
	import Input from '$lib/components/ui/input/input.svelte';
	import { toast } from 'svelte-sonner';
	import { Label } from '$lib/components/ui/label';
	import References from '$lib/components/custom/references/references.svelte';

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

<div class="mb-4 flex h-screen">
	<section class="flex-1 pr-4">
		<header class="flex justify-between mb-6">
			<h1 class="text-xl font-bold block">UUID Generator</h1>
			<div class="flex items-center gap-4">
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
									<DropdownMenu.Item onclick={loadExample3}>
										<Album />
										Example 3
									</DropdownMenu.Item><DropdownMenu.Item onclick={loadExample4}>
										<Album />
										Example 4
									</DropdownMenu.Item>
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</ButtonGroup.Root>
					<ButtonGroup.Root>
						<Button size="icon" variant="destructive" onclick={clearInput}><Trash2 /></Button>
					</ButtonGroup.Root>
					<ButtonGroup.Root>
						<Button size="icon" onclick={generate}><ArrowBigRight /></Button>
					</ButtonGroup.Root>
				</ButtonGroup.Root>
			</div>
		</header>

		<div>
			<div class="mb-4">
				<Label for="uuidVersion" class="font-bold mb-3">Version</Label>
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
					<Label for="namespace" class="font-bold mb-3">Namespace</Label>
					<Input placeholder="Namespace" name="namespace" required bind:value={namespace} />
				</div>
				<div class="mb-4">
					<Label for="name" class="font-bold mb-3">Name</Label>
					<Input placeholder="Name" name="name" bind:value={name} required />
				</div>
			{:else}
				<div class="mb-4">
					<Label for="quantity" class="font-bold mb-3">Quantity</Label>
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

<References
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
