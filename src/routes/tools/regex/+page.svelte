<script lang="ts">
	import { formatHtml, exampleFormatHtml, exampleFormatHtml2 } from '$lib/core/format-html';
	import CodeEditor from '$lib/components/custom/code-editor/code-editor.svelte';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { EllipsisVertical, Trash2, Clipboard, Album, ChevronDownIcon } from '@lucide/svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Select from '$lib/components/ui/select';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import References from '$lib/components/custom/references/references.svelte';

	let regexInput = $state('');
	let textInput = $state('');
	let selectedMatches = $state('g');
	let matchOptions = {
		g: 'Global',
		i: 'Ignore Case',
		m: 'Multiline',
		s: 'Single line',
		u: 'Unicode',
		y: 'Sticky'
	};

	function clearInput() {
		textInput = '';
	}

	function copyOutput() {
		copyText('');
	}

	function loadExample1() {
		textInput = exampleFormatHtml;
	}

	function loadExample2() {
		textInput = exampleFormatHtml2;
	}
</script>

<div class="mb-4 flex h-screen">
	<section class="flex-1 pr-4">
		<header class="flex justify-between mb-6">
			<h1 class="text-xl font-bold block">Regex Tester</h1>
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
						<Button size="icon" variant="destructive" onclick={clearInput}><Trash2 /></Button>
					</ButtonGroup.Root>
				</ButtonGroup.Root>
			</div>
		</header>

		<div class="flex items-center mb-6">
			<InputGroup.Root>
				<InputGroup.Input
					id="search-input"
					autofocus
					placeholder="Enter your regex pattern..."
					bind:value={regexInput}
					onkeydown={() => {}}
					class="w-60"
				/>
				<InputGroup.Addon>
					<div>/</div>
				</InputGroup.Addon>
				<InputGroup.Addon align="inline-end">
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<InputGroup.Button {...props} class="!pe-1.5 text-xs">
									/g <ChevronDownIcon class="size-3" />
								</InputGroup.Button>
							{/snippet}
						</DropdownMenu.Trigger>

						<DropdownMenu.Content align="end" class="[--radius:0.95rem]">
							<DropdownMenu.Group>
								<DropdownMenu.Label>Match Options</DropdownMenu.Label>
								<DropdownMenu.Separator />
								<DropdownMenu.RadioGroup bind:value={selectedMatches}>
									{#each Object.entries(matchOptions) as [key, label]}
										<DropdownMenu.RadioItem value={key}>
											{label}
										</DropdownMenu.RadioItem>
									{/each}
								</DropdownMenu.RadioGroup>
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</InputGroup.Addon>
			</InputGroup.Root>
		</div>

		<CodeEditor class="h-[500px]!" language="text" bind:value={textInput} />
	</section>
</div>

<References
	references={[
		{
			title: 'Regex 101',
			url: 'https://regex101.com/'
		}
	]}
/>
