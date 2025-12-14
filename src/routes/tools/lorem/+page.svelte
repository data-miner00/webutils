<script lang="ts">
	import * as lorem from '$lib/core/lorem-ipsum-generator';
	import { clickToCopy } from '$lib/core/copy-to-clipboard';
	import { Button } from '$lib/components/ui/button';
	import ClipboardIcon from '@lucide/svelte/icons/clipboard';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';

	let wordCount = $state(100);
	let paragraphCount = $state(3);
	let sentenceCount = $state(5);
	let useStartingLorem = $state(true);

	let loremByWordCount = $derived(lorem.generateWords(wordCount, useStartingLorem));
	let loremByParagraphCount = $derived(
		lorem.generateParagraphs(paragraphCount, useStartingLorem).split('\n')
	);
	let loremBySentenceCount = $derived(lorem.generateSentences(sentenceCount, useStartingLorem));
</script>

<h1 class="text-3xl font-bold mb-4">Lorem Ipsum Generator</h1>

<div class="space-y-6">
	<div class="space-y-2 bg-gray-50 rounded p-2 flex items-center gap-2">
		<Checkbox bind:checked={useStartingLorem} id="useStartingLorem" />
		<label for="useStartingLorem" class="font-medium block"
			>Start with standard "Lorem ipsum dolor sit amet..."</label
		>
	</div>

	<div class="space-y-2">
		<label for="wordCount" class="block font-medium">Number of Words:</label>
		<input
			id="wordCount"
			type="number"
			min="1"
			bind:value={wordCount}
			class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>
		<p class="text-sm text-gray-600" id="loremByWordCount">{loremByWordCount}</p>

		<Button
			variant="outline"
			size="sm"
			{@attach (node: HTMLElement) => clickToCopy(node, '#loremByWordCount')}
		>
			<ClipboardIcon />
			Copy
		</Button>

		<div class="bg-gray-100 px-2 py-1 rounded">
			Characters: {loremByWordCount.length} Words: {wordCount} Lines: {loremByWordCount.split('\n')
				.length}
		</div>
	</div>

	<div class="space-y-2">
		<label for="paragraphCount" class="block font-medium">Number of Paragraphs:</label>
		<input
			id="paragraphCount"
			type="number"
			min="1"
			bind:value={paragraphCount}
			class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>
		<div class="mt-2 space-y-4" id="loremByParagraphCount">
			{#each loremByParagraphCount as paragraph, index (index)}
				<p class="text-sm text-gray-600">{paragraph}</p>
			{/each}
		</div>
		<Button
			variant="outline"
			size="sm"
			{@attach (node: HTMLElement) => clickToCopy(node, '#loremByParagraphCount')}
		>
			<ClipboardIcon />
			Copy
		</Button>

		<div class="bg-gray-100 px-2 py-1 rounded">
			Characters: {loremByParagraphCount.length} Words: {loremByParagraphCount.join('\n').split(' ')
				.length} Lines: {paragraphCount + paragraphCount - 1}
		</div>
	</div>

	<div class="space-y-2">
		<label for="sentenceCount" class="block font-medium">Number of Sentences:</label>
		<input
			id="sentenceCount"
			type="number"
			min="1"
			bind:value={sentenceCount}
			class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>
		<p class="text-sm text-gray-600" id="loremBySentenceCount">
			{loremBySentenceCount}
		</p>
		<Button
			variant="outline"
			size="sm"
			{@attach (node: HTMLElement) => clickToCopy(node, '#loremBySentenceCount')}
		>
			<ClipboardIcon />
			Copy
		</Button>
		<div class="bg-gray-100 px-2 py-1 rounded">
			Characters: {loremBySentenceCount.length} Words: {loremBySentenceCount.split(' ').length} Lines:
			1
		</div>
	</div>
</div>

<a href="https://www.lipsum.com/" target="_blank" class="underline font-bold">Lorem Ipsum</a>
