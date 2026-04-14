<script lang="ts">
	import { ArrowUpRightIcon, Clipboard, FileTextIcon, Trash2 } from '@lucide/svelte';

	import CodeEditor from '$lib/components/custom/code-editor/code-editor.svelte';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Empty from '$lib/components/ui/empty/index.js';
	import * as Select from '$lib/components/ui/select';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import {
		calculateReadingTimeInMins,
		calculateSizeInKB,
		calculateWordDistribution,
		countCharacters,
		countLines,
		countParagraphs,
		countWords,
		sampleText
	} from '$lib/core/word-counter';

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
		copyText(
			JSON.stringify({
				input,
				stats: {
					characterCount: characterOutput,
					lineCount: lineOutput,
					wordCount: wordOutput,
					paragraphCount: paragraphOutput,
					readingTimeInMins: readingTimeOutput,
					sizeInKB: sizeInKBOutput
				},
				wordDistribution: Object.fromEntries(wordDistributionOutput)
			})
		);
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

<div class="grid h-full grid-cols-2 gap-4 px-4 py-6">
	<section class="flex flex-1 flex-col overflow-hidden">
		<header class="mb-6 flex justify-between">
			<h1 class="block text-xl font-bold">Text Statistics</h1>

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
		<CodeEditor class="flex-1" language="text" bind:value={input} />
	</section>

	<section class="flex flex-1 flex-col overflow-hidden">
		<header class="mb-6 flex justify-between">
			<h2 class="block text-xl font-bold">Output</h2>

			<ButtonGroup.Root>
				<Button variant="outline" onclick={copyOutput}><Clipboard /> Copy JSON output</Button>
			</ButtonGroup.Root>
		</header>

		<div class="mb-6 flex flex-wrap gap-4">
			{@render statsBox('Lines', `${lineOutput}`)}
			{@render statsBox('Characters', `${characterOutput}`)}
			{@render statsBox('Words', `${wordOutput}`)}
			{@render statsBox('Paragraphs', `${paragraphOutput}`)}
			{@render statsBox('Reading time', `${readingTimeOutput} mins`)}
			{@render statsBox('Total size', `${sizeInKBOutput.toFixed(3)} KB`)}
		</div>

		<h2 class="mb-4 text-xl font-bold">Word Distribution</h2>

		{#if wordDistributionOutput.size === 0}
			<Empty.Root class="border border-solid border-gray-300">
				<Empty.Header>
					<Empty.Media variant="icon">
						<FileTextIcon />
					</Empty.Media>
					<Empty.Title>Input Empty</Empty.Title>
					<Empty.Description>
						You haven't entered any text yet. Please enter some text to see word distribution.
					</Empty.Description>
				</Empty.Header>
				<Empty.Content>
					<div class="flex gap-2">
						<Button onclick={() => (input = 'Hello World!')}>Use Example 1</Button>
						<Button variant="outline" onclick={() => (input = sampleText)}>Use Example 2</Button>
					</div>
				</Empty.Content>
				<Button variant="link" class="text-muted-foreground" size="sm">
					<a href="#/">
						Learn More <ArrowUpRightIcon class="inline" />
					</a>
				</Button>
			</Empty.Root>
		{:else}
			<div
				class="min-h-[300px] flex-1 overflow-y-scroll rounded border border-solid border-gray-300 p-4"
			>
				{#each [...wordDistributionOutput.entries()].sort((a, b) => b[1] - a[1]) as [word, count]}
					<div class="mb-2 flex justify-between">
						<div class="rounded border border-solid border-gray-300 bg-gray-200 px-2 font-mono">
							{word}
						</div>
						<div>
							<span class="inline-block h-4 rounded bg-blue-500" style="width: {count * 10}px;"
							></span>

							x{count}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>
