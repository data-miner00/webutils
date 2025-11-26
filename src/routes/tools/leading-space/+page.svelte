<script lang="ts">
	import { removeIndentation } from '$lib/core/remove-indentation';

	let smartMode = $state(true);

	let input = $state(' ');
	let output = $derived(removeIndentation(input, smartMode));
</script>

<h1 class="text-3xl font-bold mb-4">Remove Leading Spaces</h1>

<div class="mb-4">
	<label for="input" class="block mb-2 font-medium">Input Text:</label>
	<textarea
		id="input"
		bind:value={input}
		rows="10"
		autocomplete="off"
		class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
	></textarea>

	<label for="output" class="block my-2 font-medium">Output Text:</label>
	<textarea
		id="output"
		value={output}
		rows="10"
		readonly
		class="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
	></textarea>
</div>
