<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import { verifyCardNumber } from '$lib/core/verify';

	let cardInput = $state('');
	let isCardValid = $derived(verifyCardNumber(cardInput));
	let inputBorderColor = $derived(
		cardInput === '' ? '' : isCardValid ? 'border-green-400' : 'border-red-400'
	);
</script>

<h1 class="text-2xl font-bold">Verify</h1>

<h2 class="my-4 text-xl">Verify Card Number</h2>

<Input bind:value={cardInput} placeholder="e.g. 123 456 7890" class={inputBorderColor} />
