<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import { verifyEmailAddress } from '$lib/core/email';
	import { verifyCardNumber } from '$lib/core/verify';

	let cardInput = $state('');
	let isCardValid = $derived(verifyCardNumber(cardInput));
	let inputBorderColor = $derived(
		cardInput === '' ? '' : isCardValid ? 'border-green-400' : 'border-red-400'
	);

	let emailInput = $state('');
	let isEmailValid = $derived(verifyEmailAddress(emailInput));
</script>

<div class="grid h-full grid-cols-2 gap-4 px-4 py-6">
	<section>
		<h1 class="text-xl font-bold">Verify</h1>

		<h2 class="my-4 text-xl">Verify Card Number</h2>

		<Input bind:value={cardInput} placeholder="e.g. 123 456 7890" class={inputBorderColor} />

		<Input bind:value={emailInput} placeholder="e.g. shaun@email.com" />

		<p>Email valid: {isEmailValid}</p>
	</section>
</div>
