<script lang="ts">
	import { Album, Clipboard, EllipsisVertical, Trash2 } from '@lucide/svelte';

	import CodeEditor from '$lib/components/custom/code-editor/code-editor.svelte';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import { removeTrailingSpace } from '$lib/core/remove-trailing-space';

	let removeEmptyLines = $state(true);
	let input = $state('');
	let output = $derived(removeTrailingSpace(input, removeEmptyLines));

	function clearInput() {
		input = '';
	}

	function copyOutput() {
		copyText(output);
	}
</script>

<div class="mb-4 flex h-screen">
	<section class="flex-1 pr-4">
		<header class="mb-6 flex justify-between">
			<h1 class="block text-xl font-bold">Trim Leading Spaces</h1>
			<div class="flex items-center gap-4">
				<div class="flex items-center space-x-2">
					<Switch id="remove-empty-lines" bind:checked={removeEmptyLines} />
					<Label for="remove-empty-lines">Remove empty lines</Label>
				</div>
				<ButtonGroup.Root>
					<ButtonGroup.Root>
						<Button variant="outline" onclick={() => (input = '    \n     \nhe   \nhehe')}
							>Example 1</Button
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
									<DropdownMenu.Item onclick={() => (input = 'hello wo    ')}>
										<Album />
										Example 2
									</DropdownMenu.Item>
									<DropdownMenu.Item onclick={() => (input = 'he   \n wo    \n jsjsjs \n')}>
										<Album />
										Example 3
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
		<CodeEditor class="h-[500px]!" language="text" bind:value={input} />
	</section>

	<section class="flex-1 pl-4">
		<header class="mb-6 flex justify-between">
			<h2 class="block text-xl font-bold">Output</h2>

			<ButtonGroup.Root>
				<Button variant="outline" onclick={copyOutput}><Clipboard /> Copy output</Button>
			</ButtonGroup.Root>
		</header>
		<CodeEditor class="h-[500px]!" language="text" value={output} readonly />
	</section>
</div>
