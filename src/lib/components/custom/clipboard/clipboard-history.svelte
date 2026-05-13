<script lang="ts">
	import { CircleAlert, ClipboardIcon } from '@lucide/svelte';

	import * as Alert from '$lib/components/ui/alert/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import { appState } from '$lib/states.svelte';

	type Props = {
		isOpen: boolean;
	};

	let { isOpen = $bindable(false) }: Props = $props();
</script>

<Sheet.Root bind:open={isOpen}>
	<Sheet.Content side="right">
		<Sheet.Header>
			<Sheet.Title>Clipboard Histories</Sheet.Title>
			<Sheet.Description>
				List of the last {appState.clipboardHistoryMaxItems} text copied to clipboard for reusing.
			</Sheet.Description>
		</Sheet.Header>
		{#if !appState.isEnableClipboardHistory}
			<Alert.Root>
				<CircleAlert />
				<Alert.Title>Clipboard history is disabled</Alert.Title>
				<Alert.Description
					>Please enable clipboard history in settings to see the list of copied text here.</Alert.Description
				>
			</Alert.Root>
		{:else}
			<div class="flex flex-col flex-wrap justify-center gap-4 px-4">
				{#each appState.clipboardHistory.toReversed() as history, index (index)}
					<div
						class="flex items-center justify-between gap-4 rounded-xl bg-gray-100 px-4 py-2 dark:bg-gray-900"
					>
						<div class="max-w-[250px] overflow-hidden text-sm text-nowrap text-ellipsis">
							{history}
						</div>
						<Button variant="ghost" onclick={() => copyText(history)}><ClipboardIcon /></Button>
					</div>
				{:else}
					<Alert.Root>
						<CircleAlert />
						<Alert.Title>No clipboard history yet</Alert.Title>
						<Alert.Description>
							There are currently no text being copied since this app launch. Copy one now to see it
							listed here.
						</Alert.Description>
					</Alert.Root>
				{/each}
			</div>
		{/if}
	</Sheet.Content>
</Sheet.Root>
