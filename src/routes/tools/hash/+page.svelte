<script lang="ts">
	// crypto.subtle.digest('SHA-256', new TextEncoder().encode('Hello, world!')).then((hashBuffer) => {
	// 	const hashArray = Array.from(new Uint8Array(hashBuffer));
	// 	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
	// 	console.log('SHA-256 Hash:', hashHex);
	// });
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import * as hashing from '$lib/core/hashing';
	import Output from '$lib/components/custom/output/output.svelte';

	let inputText = $state('');

	let output = $derived({
		md5: inputText ? hashing.md5(inputText) : '',
		sha1: inputText ? hashing.sha1(inputText) : '',
		sha256: inputText ? hashing.sha256(inputText) : '',
		sha384: inputText ? hashing.sha384(inputText) : '',
		sha512: inputText ? hashing.sha512(inputText) : '',
		base64: inputText ? hashing.base64Encode(inputText) : '',
		hex: inputText ? hashing.hex(inputText) : '',
		urlEncode: inputText ? encodeURIComponent(inputText) : ''
	});
</script>

<h1 class="text-2xl font-bold mb-2">String Hashing & Digest</h1>

<Textarea
	bind:value={inputText}
	placeholder="Enter text to hash..."
	rows={10}
	class="w-full mb-4"
/>

<div class="grid grid-cols-3 gap-2">
	<Output title="MD5" bind:value={output.md5} subtitle="128-bit hash (32 hex chars)" />
	<Output title="SHA1" bind:value={output.sha1} subtitle="160-bit hash (40 hex chars)" />
	<Output title="SHA256" bind:value={output.sha256} subtitle="256-bit hash (64 hex chars)" />
	<Output title="SHA384" bind:value={output.sha384} subtitle="384-bit hash (96 hex chars)" />
	<Output title="SHA512" bind:value={output.sha512} subtitle="512-bit hash (128 hex chars)" />
	<Output title="Base64" bind:value={output.base64} subtitle="Base64 Encoded String" />
	<Output title="Hex" bind:value={output.hex} subtitle="Hexadecimal representation" />
	<Output title="URL Encode" bind:value={output.urlEncode} subtitle="URL-safe encoding" />
</div>
