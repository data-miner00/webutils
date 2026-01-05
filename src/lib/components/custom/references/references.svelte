<script lang="ts">
	import type { References } from '$lib/core/references';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { AlertCircleIcon } from '@lucide/svelte';
	import Link from '../link/link.svelte';

	type Props = {
		references: References;
	};

	let { references }: Props = $props();
</script>

<article class="border-t border-solid border-gray-200 mt-6 pt-4">
	<h2 class="text-2xl font-bold">References</h2>
	<p class="mb-6">Here are a list of useful apps that inspired this utility.</p>

	<div class="flex gap-4 flex-wrap">
		{#each references as reference, index (index)}
			<Link title={reference.title} url={reference.url} />
		{:else}
			<Alert.Root>
				<AlertCircleIcon />
				<Alert.Title>No references defined</Alert.Title>
				<Alert.Description
					>There are currently no references defined for this utility. If you believe this is not
					intended, please contact the helpdesk for escalation.</Alert.Description
				>
			</Alert.Root>
		{/each}
	</div>
</article>
