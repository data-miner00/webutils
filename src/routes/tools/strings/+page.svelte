<script lang="ts">
	import { Album, EllipsisVertical, Trash2 } from '@lucide/svelte';

	import Output from '$lib/components/custom/output/output.svelte';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { safeToBase64Encode } from '$lib/core/base64';
	import * as sutil from '$lib/core/string-utils';

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

<header class="mb-6 flex justify-between">
	<h1 class="block text-xl font-bold">String Transformations</h1>
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
	class="mb-4 w-full"
	autocomplete="off"
/>

<div class="grid grid-cols-3 gap-2">
	<Output title="Trimmed" value={output.trim} subtitle="Whitespace removed from both ends" />
	<Output title="Uppercase" value={output.toUpperCase} subtitle="All characters in uppercase" />
	<Output title="Lowercase" value={output.toLowerCase} subtitle="All characters in lowercase" />
	<Output title="Snake case" value={output.toSnakeCase} subtitle="snake_case format" />
	<Output title="Kebab case" value={output.toKebabCase} subtitle="kebab-case format" />
	<Output title="Camel case" value={output.toCamelCase} subtitle="camelCase format" />
	<Output title="Title case" value={output.toTitleCase} subtitle="Title Case Format" />
	<Output title="Constant case" value={output.toConstantCase} subtitle="CONSTANT_CASE format" />
	<Output title="Dot case" value={output.toDotCase} subtitle="dot.case format" />
	<Output title="Sentence case" value={output.toSentenceCase} subtitle="Sentence case format" />
	<Output title="Base64 Encoded" value={output.toBase64} subtitle="Base64 Encoded String" />
	<Output title="Capitalized" value={output.capitalize} subtitle="First letter capitalized" />
	<Output title="Reversed" value={output.reverse} subtitle="Characters reversed" />
</div>
