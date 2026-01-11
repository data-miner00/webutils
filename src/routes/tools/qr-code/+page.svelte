<script lang="ts" module>
	declare const QRCode: any;
</script>

<script lang="ts">
	import { Switch } from '$lib/components/ui/switch/index.js';
	import CodeEditor from '$lib/components/custom/code-editor/code-editor.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { EllipsisVertical, Trash2, Clipboard, Album, Download } from '@lucide/svelte';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { example1, example2, example3 } from '$lib/core/qr-code';

	let smartMode = $state(true);
	let input = $state('');

	function clearInput() {
		input = '';
	}

	let qrcode: any;
	let isLoaded = $state(false);
	const size = 200;

	function generateQRCode() {
		qrcode = new QRCode('qrcode', {
			text: 'hello',
			width: size,
			height: size,
			colorDark: '#000000',
			colorLight: '#ffffff',
			correctLevel: QRCode.CorrectLevel.H
		});
	}

	$effect(() => {
		if (isLoaded && !input) {
			generateQRCode();
		}
		if (isLoaded && input) {
			qrcode.makeCode(input);
		}
	});

	function downloadQRCode() {
		const img = document.querySelector('#qrcode img') as HTMLImageElement;
		if (img) {
			const link = document.createElement('a');
			link.href = img.src;
			link.download = 'qrcode.png';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}
</script>

<!-- Doing this is not offline-guaranteed. Need to download and self host instead  -->
<svelte:head>
	<script
		src="https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js"
		onload={() => (isLoaded = true)}
	></script>
</svelte:head>

<div class="mb-4 flex h-screen">
	<section class="flex-1 pr-4">
		<header class="flex justify-between mb-6">
			<h1 class="text-xl font-bold block">QR Code</h1>
			<div class="flex items-center gap-4">
				<div class="flex items-center space-x-2">
					<Switch bind:checked={smartMode} />
					<Label for="smart-mode">Smart Mode</Label>
				</div>
				<ButtonGroup.Root>
					<ButtonGroup.Root>
						<Button variant="outline" onclick={() => (input = example1)}>Example 1</Button>
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
									<DropdownMenu.Item onclick={() => (input = example2)}>
										<Album />
										Example 2
									</DropdownMenu.Item>
									<DropdownMenu.Item onclick={() => (input = example3)}>
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
				</ButtonGroup.Root>
			</div>
		</header>
		<CodeEditor class="h-[500px]!" language="text" bind:value={input} />
	</section>

	<section class="flex-1 pl-4">
		<header class="flex justify-between mb-6">
			<h2 class="text-xl font-bold block">Output</h2>

			<ButtonGroup.Root>
				<Button variant="outline" onclick={downloadQRCode}><Download /> Download QR Code</Button>
			</ButtonGroup.Root>
		</header>
		<div class="flex items-center justify-center h-[500px] border border-gray-300 p-4">
			<div id="qrcode"></div>
		</div>
	</section>
</div>
