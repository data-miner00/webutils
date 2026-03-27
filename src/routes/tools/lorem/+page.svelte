<script lang="ts">
	import { ArrowBigRight, Clipboard } from '@lucide/svelte';

	import CodeEditor from '$lib/components/custom/code-editor/code-editor.svelte';
	import ReferencesSheet from '$lib/components/custom/references/references-sheet.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as NativeSelect from '$lib/components/ui/native-select/index.js';
	import { Switch } from '$lib/components/ui/switch';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import * as lorem from '$lib/core/lorem-ipsum-generator';

	let count = $state(5);
	let useStartingLorem = $state(true);
	let output = $state('');
	let selectedMethod = $state<'paragraph' | 'sentence' | 'word'>('paragraph');

	function copyOutput() {
		copyText(output);
	}

	function generateIpsum() {
		switch (selectedMethod) {
			case 'paragraph':
				output = lorem.generateParagraphs(count, useStartingLorem);
				break;
			case 'sentence':
				output = lorem.generateSentences(count, useStartingLorem);
				break;
			default:
				output = lorem.generateWords(count, useStartingLorem);
		}
	}
</script>

<div class="mb-4 flex">
	<section class="flex-1 pr-4">
		<header class="mb-6 flex justify-between">
			<h1 class="block text-xl font-bold">Lorem Ipsum</h1>

			<Button onclick={generateIpsum}><ArrowBigRight /></Button>
		</header>
		<div>
			<div class="mb-6">
				<Label for="input" class="mb-2">How long do you want to generate?</Label>

				<div class="flex items-center gap-4">
					<Input bind:value={count} type="number" name="input" class="flex-1" />
					<NativeSelect.Root class=" basis-1/6" bind:value={selectedMethod}>
						<NativeSelect.Option value="paragraph">Paragraph</NativeSelect.Option>
						<NativeSelect.Option value="sentence">Sentence</NativeSelect.Option>
						<NativeSelect.Option value="wors">Word</NativeSelect.Option>
					</NativeSelect.Root>
				</div>
			</div>

			<div class="flex items-center space-x-2">
				<Switch bind:checked={useStartingLorem} />
				<Label for="smart-mode">Start with "Lorem ipsum dolor sit amet.."</Label>
			</div>
		</div>
	</section>

	<section class="flex-1 pl-4">
		<header class="mb-6 flex justify-between">
			<h2 class="block text-xl font-bold">Output</h2>

			<ButtonGroup.Root>
				<Button variant="outline" onclick={copyOutput}><Clipboard /> Copy output</Button>

				<ReferencesSheet references={[{ title: 'Lorem Ipsum', url: 'https://www.lipsum.com/' }]} />
			</ButtonGroup.Root>
		</header>
		<CodeEditor class="h-[500px]!" language="text" value={output} readonly />
	</section>
</div>
