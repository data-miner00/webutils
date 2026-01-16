<script lang="ts">
	import * as sutil from '$lib/core/string-utils';
	import Output from '$lib/components/custom/output/output.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { EllipsisVertical, Trash2, Album } from '@lucide/svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { safeToBase64Encode } from '$lib/core/base64';

	let input = $state('');
	let output = $derived({
		trim: input.trim(),
		toUpperCase: input.toUpperCase(),
		toLowerCase: input.toLowerCase(),
		toSnakeCase: sutil.toSnakeCase(input),
		toKebabCase: sutil.toKebabCase(input),
		toCamelCase: sutil.toCamelCase(input),
		toTitleCase: sutil.toTitleCase(input),
		toConstantCase: sutil.toConstantCase(input),
		toDotCase: sutil.toDotCase(input),
		toSentenceCase: sutil.toSentenceCase(input),
		toBase64: safeToBase64Encode(input),
		capitalize: input.charAt(0).toUpperCase() + input.slice(1).toLowerCase(),
		reverse: sutil.reverseString(input)
	});

	function clearInput() {
		input = '';
	}

	function loadExample() {
		input = sutil.example1;
	}

	function loadExample2() {
		input = sutil.example2;
	}
</script>

<header class="flex justify-between mb-6">
	<h1 class="text-xl font-bold block">String Transformations</h1>
	<div class="flex items-center gap-4">
		<ButtonGroup.Root>
			<ButtonGroup.Root>
				<Button variant="outline" onclick={loadExample}>Example 1</Button>
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
<Textarea
	bind:value={input}
	placeholder="Enter text to transform..."
	rows={10}
	class="w-full mb-4"
	autocomplete="off"
/>

<div class="grid grid-cols-3 gap-2">
	<Output title="Trimmed" bind:value={output.trim} subtitle="Whitespace removed from both ends" />
	<Output
		title="Uppercase"
		bind:value={output.toUpperCase}
		subtitle="All characters in uppercase"
	/>
	<Output
		title="Lowercase"
		bind:value={output.toLowerCase}
		subtitle="All characters in lowercase"
	/>
	<Output title="Snake case" bind:value={output.toSnakeCase} subtitle="snake_case format" />
	<Output title="Kebab case" bind:value={output.toKebabCase} subtitle="kebab-case format" />
	<Output title="Camel case" bind:value={output.toCamelCase} subtitle="camelCase format" />
	<Output title="Title case" bind:value={output.toTitleCase} subtitle="Title Case Format" />
	<Output
		title="Constant case"
		bind:value={output.toConstantCase}
		subtitle="CONSTANT_CASE format"
	/>
	<Output title="Dot case" bind:value={output.toDotCase} subtitle="dot.case format" />
	<Output
		title="Sentence case"
		bind:value={output.toSentenceCase}
		subtitle="Sentence case format"
	/>
	<Output title="Base64 Encoded" bind:value={output.toBase64} subtitle="Base64 Encoded String" />
	<Output title="Capitalized" bind:value={output.capitalize} subtitle="First letter capitalized" />
	<Output title="Reversed" bind:value={output.reverse} subtitle="Characters reversed" />
</div>
