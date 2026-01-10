<script lang="ts">
	import CodeEditor from '$lib/components/custom/code-editor/code-editor.svelte';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { EllipsisVertical, Trash2, Clipboard, Album, ArrowBigRight } from '@lucide/svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import DiffEditor from '$lib/components/custom/code-editor/diff-editor.svelte';

	let original = $state('');
	let modified = $state('');
	let viewDiff = $state(false);

	function clearInput() {
		original = '';
		modified = '';
		viewDiff = false;
	}

	function copyOutput() {
		// copyText(output);
	}

	const exampleOriginal =
		'This line is removed on the right.\njust some text\nabcd\nefgh\nSome more text';
	const exampleModified =
		'just some text\nabcz\nzzzzefgh\nSome more text.\nThis line is removed on the left.';

	function loadExample1() {
		original = exampleOriginal;
		modified = exampleModified;
	}

	function scrollToBottom() {
		window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
	}

	function toggleViewDiff() {
		viewDiff = !viewDiff;
	}

	$effect(() => {
		if (viewDiff) {
			scrollToBottom();
		}
	});
</script>

<div class="mb-8 flex">
	<section class="flex-1 pr-4">
		<header class="flex justify-between mb-6">
			<h2 class="text-xl font-bold block">Original</h2>
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
									<DropdownMenu.Item onclick={() => (original = '')}>
										<Album />
										Example 2
									</DropdownMenu.Item>
									<DropdownMenu.Item onclick={() => (original = '')}>
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
					<ButtonGroup.Root>
						<Button size="icon" onclick={toggleViewDiff}><ArrowBigRight /></Button>
					</ButtonGroup.Root>
				</ButtonGroup.Root>
			</div>
		</header>
		<CodeEditor class="h-[500px]!" language="text" bind:value={original} />
	</section>

	<section class="flex-1 pl-4">
		<header class="flex justify-between mb-6">
			<h2 class="text-xl font-bold block">Modified</h2>

			<ButtonGroup.Root>
				<Button variant="outline" onclick={copyOutput}><Clipboard /> Copy output</Button>
			</ButtonGroup.Root>
		</header>
		<CodeEditor class="h-[500px]!" language="text" bind:value={modified} />
	</section>
</div>

{#if viewDiff}
	<h2 class="text-xl font-bold block mb-6">Diff</h2>
	<div class="h-[500px]">
		<DiffEditor {original} {modified} language="text/plain" class="h-full" />
	</div>
{/if}
