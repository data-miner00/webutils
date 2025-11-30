<script lang="ts">
	import { decodeJwt } from '$lib/core/jwt.js';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';

	let jwtInput = $state('');
	let decodedResult = $derived(decodeJwt(jwtInput));
</script>

<h1 class="text-3xl font-bold mb-4">JSON Web Token (JWT) Debugger</h1>

<label for="jwtInput" class="block mb-2 font-medium">Enter JWT:</label>
<Textarea
	id="jwtInput"
	bind:value={jwtInput}
	rows={5}
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
{:else}
	<div class="text-red-600 font-medium">Error: {decodedResult.message}</div>
{/if}

<a href="https://www.jwt.io/" target="_blank">Original Jwt Debugger</a>
