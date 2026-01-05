<script lang="ts">
	import { decodeJwt } from '$lib/core/jwt.js';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import References from '$lib/components/custom/references/references.svelte';

	let jwtInput = $state('');
	let secret = $state('');
	let decodedResult = $derived(await decodeJwt(jwtInput, secret));
</script>

<h1 class="text-3xl font-bold mb-4">JSON Web Token (JWT) Debugger</h1>

<label for="jwtInput" class="block mb-2 font-medium">Enter JWT:</label>
<Textarea
	id="jwtInput"
	placeholder="JWT Token"
	bind:value={jwtInput}
	rows={5}
	autocomplete="off"
	class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
></Textarea>

<Textarea
	id="secret"
	bind:value={secret}
	rows={1}
	placeholder="Secret (optional)"
	autocomplete="off"
	class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
></Textarea>

{#if decodedResult.success}
	<div class="mb-4">
		<h2 class="text-2xl font-semibold mb-2">Decoded Header:</h2>
		<pre class="bg-gray-100 p-4 rounded-md overflow-x-auto">{JSON.stringify(
				decodedResult.data.header,
				null,
				2
			)}</pre>
	</div>
	<div class="mb-4">
		<h2 class="text-2xl font-semibold mb-2">Decoded Payload:</h2>
		<pre class="bg-gray-100 p-4 rounded-md overflow-x-auto">{JSON.stringify(
				decodedResult.data.payload,
				null,
				2
			)}</pre>
	</div>
	<div class="mb-4">
		<h2 class="text-2xl font-semibold mb-2">Signature Valid:</h2>
		<div>{decodedResult.verified ? 'Yes' : 'No'}</div>
	</div>
{:else}
	<div class="text-red-600 font-medium">Error: {decodedResult.message}</div>
{/if}

<References
	references={[
		{
			title: 'JWT.io',
			url: 'https://www.jwt.io/'
		}
	]}
/>
