<script lang="ts">
	import * as monaco from 'monaco-editor';
	import { onMount } from 'svelte';
	import './fixMonacoEditor';

	interface ICodeEditorProps {
		language?: string;
		readonly?: boolean;
		value?: string;
		className?: string;
	}

	let { language, readonly, value = $bindable(undefined), className }: ICodeEditorProps = $props();

	let editorRef: HTMLDivElement;
	let editor: monaco.editor.IStandaloneCodeEditor;

	let theme = $state<'light' | 'dark'>('light');
	let wordWrap = $derived<'on' | 'off'>(language == 'text' ? 'on' : 'off');

	onMount(() => {
		if (!editorRef) {
			return;
		}

		editor = monaco.editor.create(editorRef!, {
			theme: theme === 'dark' ? 'vs-dark' : '',
			value: value,
			language: language,
			fontSize: 14,
			tabSize: 2,
			contextmenu: false,
			readOnly: readonly,
			quickSuggestions: language !== 'text',
			scrollBeyondLastLine: false,
			automaticLayout: true,
			wordWrap,
			inlayHints: {
				enabled: 'off'
			},
			padding: {
				top: 16,
				bottom: 16
			},
			minimap: {
				enabled: false
			},
			scrollbar: {
				horizontalScrollbarSize: 8,
				verticalScrollbarSize: 8
			}
		});

		if (readonly) {
			const messageContribution = editor.getContribution('editor.contrib.messageController');
			editor.onDidAttemptReadOnlyEdit(() => {
				if (messageContribution) {
					messageContribution.dispose();
				}
			});
		}

		editor.getModel()!.onDidChangeContent(() => {
			value = editor.getValue();
		});

		return () => editor.dispose();
	});

	$effect(() => {
		if (value !== editor.getValue()) {
			editor.setValue(value || '');
		}
	});
</script>

<div
	bind:this={editorRef}
	class={`border border-solid border-gray-300 h-full min-h-[250px] ${className}`}
></div>
