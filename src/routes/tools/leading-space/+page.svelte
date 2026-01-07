<script lang="ts">
	import { removeIndentation } from '$lib/core/remove-indentation';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import CodeEditor from '$lib/components/custom/code-editor/code-editor.svelte';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { EllipsisVertical, Trash2, Clipboard, Album } from '@lucide/svelte';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	let smartMode = $state(true);
	let input = $state('');
	let output = $derived(removeIndentation(input, smartMode));

	function clearInput() {
		input = '';
	}

	function copyOutput() {
		copyText(output);
	}
</script>

<div class="mb-4 flex h-screen">
	<section class="flex-1 pr-4">
		<header class="flex justify-between mb-6">
			<h1 class="text-xl font-bold block">Trim Leading Spaces</h1>
			<div class="flex items-center gap-4">
				<div class="flex items-center space-x-2">
					<Switch bind:checked={smartMode} />
					<Label for="smart-mode">Smart Mode</Label>
				</div>
				<ButtonGroup.Root>
					<ButtonGroup.Root>
						<Button variant="outline">Example 1</Button>
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
									<DropdownMenu.Item>
										<Album />
										Example 2
									</DropdownMenu.Item>
									<DropdownMenu.Item>
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
		<header class="flex justify-between mb-6">
			<h2 class="text-xl font-bold block">Output</h2>

			<ButtonGroup.Root>
				<Button variant="outline" onclick={copyOutput}><Clipboard /> Copy output</Button>
			</ButtonGroup.Root>
		</header>
		<CodeEditor class="h-[500px]!" language="text" value={output} readonly />
	</section>
</div>
