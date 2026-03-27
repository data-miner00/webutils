<script lang="ts">
	import {
		Album,
		ArrowBigRight,
		Check,
		Clipboard,
		EllipsisVertical,
		Trash2,
		X
	} from '@lucide/svelte';

	import CodeEditor from '$lib/components/custom/code-editor/code-editor.svelte';
	import ReferencesSheet from '$lib/components/custom/references/references-sheet.svelte';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import {
		type Response,
		decodeJwt,
		exampleDecodeJwt,
		exampleDecodeJwt2,
		exampleDecodeJwt3
	} from '$lib/core/jwt.js';

	let jwtInput = $state('');
	let secret = $state('');
	let decodedResult = $state<Response>({
		success: false,
		message: 'No JWT decoded yet.'
	});
	let headerJson = $derived(
		decodedResult.success ? JSON.stringify(decodedResult.data.header, null, 2) : ''
	);
	let payloadJson = $derived(
		decodedResult.success ? JSON.stringify(decodedResult.data.payload, null, 2) : ''
	);
	let verified = $derived(decodedResult.success && decodedResult.verified);

	async function decodeJwtInput() {
		decodedResult = await decodeJwt(jwtInput, secret);
	}

	function clearInput() {
		jwtInput = '';
		secret = '';
		decodedResult = {
			success: false,
			message: 'No JWT decoded yet.'
		};
	}

	function copyEncodedInput() {
		copyText(jwtInput);
	}

	function clearEncodedInput() {
		jwtInput = '';
	}

	function copySecret() {
		copyText(secret);
	}

	function clearSecret() {
		secret = '';
	}

	function copyHeader() {
		copyText(headerJson);
	}
	function copyPayload() {
		copyText(payloadJson);
	}

	function loadExample1() {
		jwtInput = exampleDecodeJwt.jwtToken;
		secret = exampleDecodeJwt.secret ?? '';
		decodeJwtInput();
	}

	function loadExample2() {
		jwtInput = exampleDecodeJwt2.jwtToken;
		secret = exampleDecodeJwt2.secret ?? '';
		decodeJwtInput();
	}

	function loadExample3() {
		jwtInput = exampleDecodeJwt3.jwtToken;
		secret = exampleDecodeJwt3.secret ?? '';
		decodeJwtInput();
	}
</script>

<div class="mb-8 flex">
	<section class="flex-1 pr-4">
		<header class="mb-6 flex justify-between">
			<h2 class="block text-xl font-bold">JWT Decoder</h2>
			<div class="flex items-center gap-4">
				<ButtonGroup.Root>
					<ButtonGroup.Root>
						<Button variant="outline" onclick={loadExample1}>Example 1</Button>
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
									<DropdownMenu.Item onclick={loadExample3}>
										<Album />
										Example 3
									</DropdownMenu.Item>
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</ButtonGroup.Root>
					<ButtonGroup.Root>
						<Button size="icon" variant="destructive" onclick={clearInput}><Trash2 /></Button>
					</ButtonGroup.Root>
					<ButtonGroup.Root>
						<Button size="icon" onclick={decodeJwtInput}><ArrowBigRight /></Button>
					</ButtonGroup.Root>
				</ButtonGroup.Root>
			</div>
		</header>

		<div class="mb-4 rounded-lg border border-solid border-gray-300">
			<div class="flex items-center justify-between p-2">
				<h2 class="font-semibold">JWT Token</h2>

				<div class="flex items-center gap-2">
					<div class="flex items-center">
						{#if decodedResult.success}
							<span class="text-green-600">
								<Check />
							</span>
							<span class="text-sm font-medium text-green-600"> Verified</span>
						{:else}
							<span class="text-red-600">
								<X />
							</span>
							<span class="text-sm font-medium text-red-600">{decodedResult.message}</span>
						{/if}
					</div>
					<ButtonGroup.Root>
						<Button variant="outline" size="sm" onclick={copyEncodedInput}
							><Clipboard /> Copy</Button
						>
						<Button variant="destructive" size="icon-sm" onclick={clearEncodedInput}
							><Trash2 /></Button
						>
					</ButtonGroup.Root>
				</div>
			</div>
			<Textarea
				id="jwtInput"
				placeholder="JWT Token"
				bind:value={jwtInput}
				rows={5}
				autocomplete="off"
				class="mb-4 h-64 w-full resize-none rounded-none border-r-0 border-b-0 border-l-0 border-gray-300 p-2 shadow-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
			></Textarea>
		</div>
		<div class="rounded-lg border border-solid border-gray-300">
			<div class="flex items-center justify-between p-2">
				<h2 class="font-semibold">Secret</h2>
				<div class="flex items-center gap-2">
					{#if decodedResult.success}
						<div class="flex items-center">
							{#if verified}
								<span class="text-green-600">
									<Check />
								</span>
								<span class="text-sm font-medium text-green-600"> Verified</span>
							{:else}
								<span class="text-red-600">
									<X />
								</span>
								<span class="text-sm font-medium text-red-600"> Not Verified </span>
							{/if}
						</div>
					{/if}
					<ButtonGroup.Root>
						<Button variant="outline" size="sm" onclick={copySecret}><Clipboard /> Copy</Button>
						<Button variant="destructive" size="icon-sm" onclick={clearSecret}><Trash2 /></Button>
					</ButtonGroup.Root>
				</div>
			</div>
			<Textarea
				id="secret"
				placeholder="Secret (optional)"
				bind:value={secret}
				rows={1}
				autocomplete="off"
				class="mb-4 h-32 w-full resize-none rounded-none border-r-0 border-b-0 border-l-0 border-gray-300 p-2 shadow-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
			></Textarea>
		</div>
	</section>

	<section class="flex-1 pl-4">
		<header class="mb-6 flex justify-between">
			<h2 class="block text-xl font-bold">Results</h2>

			<ButtonGroup.Root>
				<Button variant="outline" onclick={copyPayload}><Clipboard /> Copy output</Button>

				<ReferencesSheet
					references={[
						{
							title: 'JWT.io',
							url: 'https://www.jwt.io/'
						}
					]}
				/>
			</ButtonGroup.Root>
		</header>

		<div class="mb-4 overflow-hidden rounded-lg border border-solid border-gray-300">
			<div class="flex items-center justify-between p-2">
				<h2 class="font-semibold">Decoded Header</h2>
				<ButtonGroup.Root>
					<Button variant="outline" size="sm" onclick={copyHeader}><Clipboard /> Copy</Button>
				</ButtonGroup.Root>
			</div>
			<CodeEditor language="json" class="h-64 border-x-0 border-b-0" value={headerJson} />
		</div>

		<div class="overflow-hidden rounded-lg border border-solid border-gray-300">
			<div class="flex items-center justify-between p-2">
				<h2 class="font-semibold">Decoded Payload</h2>
				<ButtonGroup.Root>
					<Button variant="outline" size="sm" onclick={copyPayload}><Clipboard /> Copy</Button>
				</ButtonGroup.Root>
			</div>
			<CodeEditor language="json" class="h-64 border-x-0 border-b-0" value={payloadJson} />
		</div>
	</section>
</div>
