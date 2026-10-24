<script lang="ts">
	import { Album, Clipboard, EllipsisVertical, SlidersHorizontal, Trash2 } from '@lucide/svelte';

	import CodeEditor from '$lib/components/custom/code-editor/code-editor.svelte';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import {
		type DocumentWriteMethod,
		type QuoteStyle,
		exampleHtmlToDocumentWrite,
		exampleHtmlToDocumentWrite2,
		htmlToDocumentWrite
	} from '$lib/core/html-to-document-write';

	const quoteLabels: Record<QuoteStyle, string> = {
		single: "Single quotes (')",
		double: 'Double quotes (")'
	};

	let input = $state('');
	let method = $state<DocumentWriteMethod>('write');
	let quote = $state<QuoteStyle>('single');
	let output = $derived(htmlToDocumentWrite(input, { method, quote }));

	function clearInput() {
		input = '';
	}

	function copyOutput() {
		copyText(output);
	}

	function loadExample1() {
		input = exampleHtmlToDocumentWrite;
	}

	function loadExample2() {
		input = exampleHtmlToDocumentWrite2;
	}
</script>

<div class="h-full grid-cols-2 gap-4 px-4 py-6 md:grid">
	<!-- Header layout follows the column's width, which the sidebar narrows at md and up -->
	<section class="@container mb-6 flex flex-1 flex-col overflow-hidden md:mb-0">
		<header class="mb-6 justify-between @lg:flex">
			<div class="mb-4 flex items-center gap-4 @lg:mb-0">
				<Sidebar.Trigger class="md:hidden" />
				<h1 class="block text-xl font-bold">HTML to document.write</h1>
			</div>
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
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</ButtonGroup.Root>
					<ButtonGroup.Root>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								{#snippet child({ props })}
									<Button
										{...props}
										size="icon"
										variant="outline"
										aria-label="Output options"
										title="Output options"
									>
										<SlidersHorizontal />
									</Button>
								{/snippet}
							</DropdownMenu.Trigger>
							<DropdownMenu.Content align="end" class="w-52">
								<DropdownMenu.Group>
									<DropdownMenu.Label>Method</DropdownMenu.Label>
									<DropdownMenu.RadioGroup bind:value={method}>
										<DropdownMenu.RadioItem value="write" class="font-mono">
											document.write
										</DropdownMenu.RadioItem>
										<DropdownMenu.RadioItem value="writeln" class="font-mono">
											document.writeln
										</DropdownMenu.RadioItem>
									</DropdownMenu.RadioGroup>
								</DropdownMenu.Group>
								<DropdownMenu.Separator />
								<DropdownMenu.Group>
									<DropdownMenu.Label>Quotes</DropdownMenu.Label>
									<DropdownMenu.RadioGroup bind:value={quote}>
										<DropdownMenu.RadioItem value="single">
											{quoteLabels.single}
										</DropdownMenu.RadioItem>
										<DropdownMenu.RadioItem value="double">
											{quoteLabels.double}
										</DropdownMenu.RadioItem>
									</DropdownMenu.RadioGroup>
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
		<CodeEditor class="flex-1" language="html" bind:value={input} />
	</section>

	<section class="flex flex-1 flex-col overflow-hidden">
		<header class="mb-6 flex justify-between">
			<h2 class="block text-xl font-bold">Output</h2>

			<ButtonGroup.Root>
				<Button variant="outline" onclick={copyOutput}><Clipboard /> Copy output</Button>
			</ButtonGroup.Root>
		</header>
		<CodeEditor class="flex-1" language="javascript" value={output} readonly />
	</section>
</div>
