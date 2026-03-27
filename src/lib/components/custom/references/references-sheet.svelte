<script lang="ts">
	import { Info } from '@lucide/svelte';
	import { CircleAlert } from '@lucide/svelte';

	import * as Alert from '$lib/components/ui/alert/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import type { References } from '$lib/core/references';

	import Link from '../link/link.svelte';

	type Props = {
		references: References;
	};

	let { references }: Props = $props();
</script>

<Sheet.Root>
	<Sheet.Trigger class={buttonVariants({ variant: 'outline', size: 'icon' })}>
		<Info />
	</Sheet.Trigger>
	<Sheet.Content side="right">
		<Sheet.Header>
			<Sheet.Title>References</Sheet.Title>
			<Sheet.Description>
				List of references or inspirations related to this tool.
			</Sheet.Description>
		</Sheet.Header>
		<div class="flex flex-col flex-wrap justify-center gap-4 px-4">
			{#each references as reference, index (index)}
				<Link title={reference.title} url={reference.url} />
			{:else}
				<Alert.Root>
					<CircleAlert />
					<Alert.Title>No references defined</Alert.Title>
					<Alert.Description
						>There are currently no references defined for this utility. If you believe this is not
						intended, please contact the helpdesk for escalation.</Alert.Description
					>
				</Alert.Root>
			{/each}
		</div>
		<Sheet.Footer>
			<Sheet.Close class={buttonVariants({ variant: 'outline' })}>Close</Sheet.Close>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
