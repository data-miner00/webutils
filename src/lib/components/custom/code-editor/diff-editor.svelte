<script lang="ts">
	import { onMount } from 'svelte';
	import * as monaco from 'monaco-editor';

	type Props = {
		original: string;
		modified: string;
		class?: string;
		language?: string;
	};

	let { original, modified, class: className, language = 'text/plain' }: Props = $props();

	let containerRef: HTMLDivElement;

	onMount(() => {
		var originalModel = monaco.editor.createModel(original, language);
		var modifiedModel = monaco.editor.createModel(modified, language);

		var diffEditor = monaco.editor.createDiffEditor(containerRef, {
			enableSplitViewResizing: false
		});

		diffEditor.setModel({
			original: originalModel,
			modified: modifiedModel
		});
	});
</script>

<div
	bind:this={containerRef}
	class={`border border-solid border-gray-300 h-full min-h-[250px] max-h-screen ${className}`}
></div>
