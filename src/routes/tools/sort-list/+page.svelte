<script lang="ts">
	import {
		Album,
		ArrowDownAZ,
		ArrowUpAZ,
		Clipboard,
		EllipsisVertical,
		Shuffle,
		Trash2
	} from '@lucide/svelte';

	import CodeEditor from '$lib/components/custom/code-editor/code-editor.svelte';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { copyText } from '$lib/core/copy-to-clipboard';

	let inputText = $state('');
	let outputText = $state('');

	function sortLinesAscending() {
		const lines = inputText.split('\n');
		lines.sort();
		outputText = lines.join('\n');
	}

	function sortLinesDescending() {
		const lines = inputText.split('\n');
		lines.sort().reverse();
		outputText = lines.join('\n');
	}

	function clearInput() {
		inputText = '';
		outputText = '';
	}

	function shuffleLines() {
		const lines = inputText.split('\n');
		for (let i = lines.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[lines[i], lines[j]] = [lines[j], lines[i]];
		}
		outputText = lines.join('\n');
	}

	function pickRandomLine() {
		const lines = inputText.split('\n');
		if (lines.length === 0) {
			outputText = '';
			return;
		}
		const randomIndex = Math.floor(Math.random() * lines.length);
		outputText = lines[randomIndex];
	}

	const example1 = `Banana
Apple
Orange
Grapes
Mango
Pineapple`;

	const example2 = `83
32
45
2
59
1`; // introduce a number mode to sort numerically

	const example3 = `20210132
20191112
20270404
20040623
20050701
20110911`;

	function copyOutput() {
		copyText(outputText);
	}
</script>

<div class="grid h-full grid-cols-2 gap-4 px-4 py-6">
	<section class="flex flex-1 flex-col overflow-hidden">
		<header class="mb-6 flex justify-between">
			<h1 class="block text-xl font-bold">Sort List</h1>
			<div class="flex items-center gap-4">
				<ButtonGroup.Root>
					<ButtonGroup.Root>
						<Button variant="outline" onclick={() => (inputText = example1)}>Example 1</Button>
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
									<DropdownMenu.Item onclick={() => (inputText = example2)}>
										<Album />
										Example 2
									</DropdownMenu.Item>
									<DropdownMenu.Item onclick={() => (inputText = example3)}>
										<Album />
										Example 3
									</DropdownMenu.Item>
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</ButtonGroup.Root>
					<ButtonGroup.Root>
						<Button size="icon" variant="outline" onclick={sortLinesAscending}
							><ArrowDownAZ /></Button
						>
						<Button size="icon" variant="outline" onclick={sortLinesDescending}
							><ArrowUpAZ /></Button
						>
						<Button size="icon" variant="outline" onclick={shuffleLines}><Shuffle /></Button>
					</ButtonGroup.Root>
					<ButtonGroup.Root>
						<Button size="icon" variant="destructive" onclick={clearInput}><Trash2 /></Button>
					</ButtonGroup.Root>
				</ButtonGroup.Root>
			</div>
		</header>
		<CodeEditor class="flex-1" language="text" bind:value={inputText} />
	</section>

	<section class="flex flex-1 flex-col overflow-hidden">
		<header class="mb-6 flex justify-between">
			<h2 class="block text-xl font-bold">Output</h2>

			<ButtonGroup.Root>
				<Button variant="outline" onclick={copyOutput}><Clipboard /> Copy output</Button>
			</ButtonGroup.Root>
		</header>
		<CodeEditor class="flex-1" language="text" value={outputText} readonly />
	</section>
</div>
