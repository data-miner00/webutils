<script lang="ts">
	import * as sutil from '$lib/core/string-utils';

	let input = $state('');
	let output = $derived({
		trim: input.trim(),
		toUpperCase: input.toUpperCase(),
		toLowerCase: input.toLowerCase(),
		toSnakeCase: sutil.toSnakeCase(input),
		toKebabCase: sutil.toKebabCase(input),
		toCamelCase: sutil.toCamelCase(input),
		toTitleCase: sutil.toTitleCase(input),
		toConstantCase: sutil.toConstantCase(input),
		toDotCase: sutil.toDotCase(input),
		toSentenceCase: sutil.toSentenceCase(input),
		toBase64: safeToBase64Encode(input),
		capitalize: input.charAt(0).toUpperCase() + input.slice(1).toLowerCase(),
		reverse: sutil.reverseString(input),
		wordCount: input.trim() ? input.trim().split(/\s+/).length : 0,
		charCount: input.length,
		lineCount: input.split('\n').length
	});

	function safeBase64Decode(str: string): string {
		try {
			return atob(str);
		} catch {
			return 'Invalid Base64 string';
		}
	}

	function safeToBase64Encode(str: string): string {
		try {
			return btoa(str);
		} catch {
			return 'Error encoding to Base64';
		}
	}
</script>

<h1 class="text-3xl font-bold mb-4">String Utils</h1>

<div class="mb-4">
	<label for="input" class="block mb-2 font-medium">Input Text:</label>
	<textarea
		id="input"
		bind:value={input}
		rows="6"
		autocomplete="off"
		class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
	></textarea>
</div>

<div class="mb-4 flex space-x-4">
	<div class="bg-gray-100 p-4 rounded-md flex-1">
		<h2 class="text-xl font-semibold mb-2">Statistics</h2>
		<ul class="list-disc list-inside space-y-1">
			<li><strong>Word Count:</strong> {output.wordCount}</li>
			<li><strong>Character Count:</strong> {output.charCount}</li>
			<li><strong>Line Count:</strong> {output.lineCount}</li>
		</ul>
	</div>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
	<div class="bg-gray-100 p-4 rounded-md">
		<h2 class="text-xl font-semibold mb-2">Transformations</h2>
		<ul class="list-disc list-inside space-y-1">
			<li><strong>Trimmed:</strong> {output.trim}</li>
			<li><strong>Uppercase:</strong> {output.toUpperCase}</li>
			<li><strong>Lowercase:</strong> {output.toLowerCase}</li>
			<li><strong>Snake Case:</strong> {output.toSnakeCase}</li>
			<li><strong>Kebab Case:</strong> {output.toKebabCase}</li>
			<li><strong>Camel Case:</strong> {output.toCamelCase}</li>
			<li><strong>Title Case:</strong> {output.toTitleCase}</li>
			<li><strong>Constant Case:</strong> {output.toConstantCase}</li>
			<li><strong>Dot Case:</strong> {output.toDotCase}</li>
			<li><strong>Sentence Case:</strong> {output.toSentenceCase}</li>
			<li><strong>Base64 Encoded:</strong> {output.toBase64}</li>
			<li><strong>Capitalized:</strong> {output.capitalize}</li>
			<li><strong>Reversed:</strong> {output.reverse}</li>
		</ul>
	</div>
</div>
