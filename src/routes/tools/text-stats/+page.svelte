<script lang="ts">
	import { Switch } from '$lib/components/ui/switch/index.js';
	import CodeEditor from '$lib/components/custom/code-editor/code-editor.svelte';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { EllipsisVertical, Trash2, Clipboard, Album } from '@lucide/svelte';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Select from '$lib/components/ui/select';
	import {
		countCharacters,
		countLines,
		countWords,
		countParagraphs,
		calculateWordDistribution,
		calculateSizeInKB,
		calculateReadingTimeInMins,
		sampleText
	} from '$lib/core/word-counter';

	let smartMode = $state(true);
	let input = $state('');
	let characterOutput = $derived(countCharacters(input));
	let lineOutput = $derived(countLines(input));
	let wordOutput = $derived(countWords(input));
	let paragraphOutput = $derived(countParagraphs(input));
	let readingTimeOutput = $derived(calculateReadingTimeInMins(input));
	let sizeInKBOutput = $derived(calculateSizeInKB(input));
	let wordDistributionOutput = $derived(calculateWordDistribution(input));

	function clearInput() {
		input = '';
	}

	function copyOutput() {
		// copy as JSON
		copyText('');
	}

	let language = $state('en');
	const languages = [
		{
			label: 'English',
			value: 'en'
		},
		{
			label: 'Spanish',
			value: 'es'
		},
		{
			label: 'Chinese',
			value: 'zh'
		}
	];

	const triggerContent = $state('English');
</script>

{#snippet statsBox(title: string, value: string)}
	<article class="h-[100px] w-[100px] rounded border border-s border-gray-300 p-4">
		<div class="text-xs text-gray-500">{title}</div>
		<div class="text-lg">{value}</div>
	</article>
{/snippet}

<div class="mb-4 flex h-screen">
	<section class="flex-1 pr-4">
		<header class="flex justify-between mb-6">
			<h1 class="text-xl font-bold block">Text Statistics</h1>

			<div class="flex items-center gap-2">
				<Select.Root type="single" name="favoriteFruit" bind:value={language}>
					<Select.Trigger class="w-[180px]">
						{triggerContent}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Languages</Select.Label>
							{#each languages as lang (lang.value)}
								<Select.Item value={lang.value} label={lang.label}>
									{lang.label}
								</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>

				<ButtonGroup.Root>
					<ButtonGroup.Root>
						<Button variant="outline" onclick={() => (input = sampleText)}>Example</Button>
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

		<div class="flex gap-4 flex-wrap mb-6">
			{@render statsBox('Lines', `${lineOutput}`)}
			{@render statsBox('Characters', `${characterOutput}`)}
			{@render statsBox('Words', `${wordOutput}`)}
			{@render statsBox('Paragraphs', `${paragraphOutput}`)}
			{@render statsBox('Reading time', `${readingTimeOutput} mins`)}
			{@render statsBox('Total size', `${sizeInKBOutput.toFixed(3)} KB`)}
		</div>

		<h2 class="text-xl font-bold mb-4">Word Distribution</h2>

		<div
			class="border border-solid border-gray-300 rounded p-4 min-h-[300px] max-h-[500px] overflow-y-scroll"
		>
			{#each [...wordDistributionOutput.entries()].sort((a, b) => b[1] - a[1]) as [word, count]}
				<div class="flex justify-between mb-2">
					<div class="font-mono bg-gray-200 rounded border border-solid border-gray-300 px-2">
						{word}
					</div>
					<div>
						<span class="inline-block h-4 bg-blue-500 rounded" style="width: {count * 10}px;"
						></span>

						x{count}
					</div>
				</div>
			{/each}
		</div>
	</section>
</div>
