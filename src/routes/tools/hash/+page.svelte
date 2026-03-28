<script lang="ts">
	// crypto.subtle.digest('SHA-256', new TextEncoder().encode('Hello, world!')).then((hashBuffer) => {
	// 	const hashArray = Array.from(new Uint8Array(hashBuffer));
	// 	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
	// 	console.log('SHA-256 Hash:', hashHex);
	// });
	import { Album, EllipsisVertical, Trash2 } from '@lucide/svelte';

	import Output from '$lib/components/custom/output/output.svelte';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import * as hashing from '$lib/core/hashing';

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

	function clearInput() {
		inputText = '';
	}

	function loadExample() {
		inputText = 'Hello, World!';
	}

	function loadExample2() {
		inputText = 'https://www.google.com?q=what is this?';
	}
</script>

<header class="mb-6 flex justify-between">
	<h1 class="block text-xl font-bold">String Hashing & Digest</h1>
	<div class="flex items-center gap-4">
		<ButtonGroup.Root>
			<ButtonGroup.Root>
				<Button variant="outline" onclick={loadExample}>Example 1</Button>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button {...props} variant="outline" aria-label="More Options">
								<EllipsisVertical />
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end" class="w-52">
						<DropdownMenu.Group>
							<DropdownMenu.Item onclick={loadExample2}>
								<Album />
								Example 2
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</ButtonGroup.Root>
			<ButtonGroup.Root>
				<Button size="icon" variant="destructive" onclick={clearInput}><Trash2 /></Button>
			</ButtonGroup.Root>
		</ButtonGroup.Root>
	</div>
</header>

<Textarea
	bind:value={inputText}
	placeholder="Enter text to hash..."
	rows={10}
	class="mb-4 w-full"
/>

<div class="grid grid-cols-3 gap-2">
	<Output title="MD5" value={output.md5} subtitle="128-bit hash (32 hex chars)" />
	<Output title="SHA1" value={output.sha1} subtitle="160-bit hash (40 hex chars)" />
	<Output title="SHA256" value={output.sha256} subtitle="256-bit hash (64 hex chars)" />
	<Output title="SHA384" value={output.sha384} subtitle="384-bit hash (96 hex chars)" />
	<Output title="SHA512" value={output.sha512} subtitle="512-bit hash (128 hex chars)" />
	<Output title="Base64" value={output.base64} subtitle="Base64 Encoded String" />
	<Output title="Hex" value={output.hex} subtitle="Hexadecimal representation" />
	<Output title="URL Encode" value={output.urlEncode} subtitle="URL-safe encoding" />
</div>
