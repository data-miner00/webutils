<script lang="ts">
	import {
		Album,
		ArrowBigRight,
		ArrowDown,
		ArrowLeft,
		EllipsisVertical,
		Trash2
	} from '@lucide/svelte';

	import CodeEditor from '$lib/components/custom/code-editor/code-editor.svelte';
	import DiffEditor from '$lib/components/custom/code-editor/diff-editor.svelte';
	import ReferencesSheet from '$lib/components/custom/references/references-sheet.svelte';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { copyText } from '$lib/core/copy-to-clipboard';

	let original = $state('');
	let modified = $state('');
	let viewDiff = $state(false);

	function clearInput() {
		original = '';
		modified = '';
		viewDiff = false;
	}

	const exampleOriginal =
		'This line is removed on the right.\njust some text\nabcd\nefgh\nSome more text';
	const exampleModified =
		'just some text\nabcz\nzzzzefgh\nSome more text.\nThis line is removed on the left.';

	const exampleCodeOriginal =
		'using System;\nusing System.Text;\n\nnamespace HelloWorld;\n\npublic class Program\n{\n    public static void Main(string[] args)\n    {\n        Console.WriteLine("Hello, World");\n    }\n}';
	const exampleCodeModified =
		'using System;\n\nnamespace HelloWorld;\n\npublic static class Program\n{\n    static void Main(string[] args)\n    {\n        Console.WriteLine("Bye, World");\n        Console.ReadKey();\n    }\n}';

	function loadExample1() {
		original = exampleOriginal;
		modified = exampleModified;
	}

	function loadExample2() {
		original = exampleCodeOriginal;
		modified = exampleCodeModified;
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
		<header class="mb-6 flex justify-between">
			<h2 class="block text-xl font-bold">Original</h2>
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
					<ButtonGroup.Root>
						<Button size="icon" onclick={toggleViewDiff}><ArrowBigRight /></Button>
					</ButtonGroup.Root>
				</ButtonGroup.Root>
			</div>
		</header>
		<CodeEditor class="h-[500px]!" language="text" bind:value={original} />
	</section>

	<section class="flex-1 pl-4">
		<header class="mb-6 flex justify-between">
			<h2 class="block text-xl font-bold">Modified</h2>

			<ButtonGroup.Root>
				<Button variant="outline" onclick={() => copyText(original)}>
					<ArrowLeft /> Copy original
				</Button>
				<Button variant="outline" onclick={() => copyText(modified)}>
					<ArrowDown /> Copy modified
				</Button>

				<ReferencesSheet
					references={[
						{
							title: 'Diffchecker',
							url: 'https://www.diffchecker.com/'
						}
					]}
				/>
			</ButtonGroup.Root>
		</header>
		<CodeEditor class="h-[500px]!" language="text" bind:value={modified} />
	</section>
</div>

{#if viewDiff}
	<h2 class="mb-6 block text-xl font-bold">Diff</h2>
	<div class="h-[500px]">
		<DiffEditor {original} {modified} language="text/plain" class="h-full" />
	</div>
{/if}
