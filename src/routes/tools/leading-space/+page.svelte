<script lang="ts">
	import { removeIndentation } from '$lib/core/remove-indentation';
	import { Switch } from '$lib/components/ui/switch/index.js';

	let smartMode = $state(true);

	let input = $state(' ');
	let output = $derived(removeIndentation(input, smartMode));
</script>

<h1 class="text-3xl font-bold mb-4">Remove Leading Spaces</h1>

<div class="flex items-center mb-4 gap-4 bg-gray-100 rounded-lg p-2 w-fit">
	<!-- <p>Smart mode removes the minimum leading spaces from all lines.</p> -->

	<div class="">
		<p>Smart mode:</p>
	</div>

	<Switch bind:checked={smartMode} />
</div>

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
