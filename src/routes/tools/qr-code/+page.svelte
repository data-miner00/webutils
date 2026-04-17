<script lang="ts" module>
	declare const QRCode: any;
</script>

<script lang="ts">
	import { Album, Clipboard, Download, EllipsisVertical, Trash2 } from '@lucide/svelte';

	import CodeEditor from '$lib/components/custom/code-editor/code-editor.svelte';
	import ReferencesSheet from '$lib/components/custom/references/references-sheet.svelte';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { example1, example2, example3 } from '$lib/core/qr-code';

	type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

	let errorCorrectionLevel = $state<ErrorCorrectionLevel>('H');
	let input = $state('');
	let errorCorrectionLabel = $derived(
		(() => {
			switch (errorCorrectionLevel) {
				case 'L':
					return 'Low (7%)';
				case 'M':
					return 'Medium (15%)';
				case 'Q':
					return 'Quartile (25%)';
				case 'H':
					return 'High (30%)';
			}
		})()
	);
	let internalErrorCorrectionLevel = $derived(
		(() => {
			switch (errorCorrectionLevel) {
				case 'L':
					return QRCode.CorrectLevel.L;
				case 'M':
					return QRCode.CorrectLevel.M;
				case 'Q':
					return QRCode.CorrectLevel.Q;
				case 'H':
					return QRCode.CorrectLevel.H;
			}
		})()
	);

	function clearInput() {
		input = '';
	}

	let qrcode: any;
	let isLoaded = $state(false);
	const size = 200;

	function generateQRCode(initialInput = 'hello') {
		console.log('Generating QR code with error correction level:', errorCorrectionLevel);
		document.getElementById('qrcode')!.innerHTML = '';
		qrcode = new QRCode('qrcode', {
			text: initialInput,
			width: size,
			height: size,
			colorDark: '#000000',
			colorLight: '#ffffff',
			correctLevel: internalErrorCorrectionLevel
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

	$effect(() => {
		if (errorCorrectionLevel) {
			generateQRCode();
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

<div class="grid h-full grid-cols-2 gap-4 px-4 py-6">
	<section class="flex flex-1 flex-col overflow-hidden">
		<header class="mb-6 flex justify-between">
			<h1 class="block text-xl font-bold">QR Code</h1>
			<div class="flex items-center gap-4">
				<Select.Root type="single" name="imageFormat" bind:value={errorCorrectionLevel}>
					<Select.Trigger>
						{errorCorrectionLabel}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Error Correction</Select.Label>
							<Select.Item value="L" label="Low (7%)">Low (7%)</Select.Item>
							<Select.Item value="M" label="Medium (15%)">Medium (15%)</Select.Item>
							<Select.Item value="Q" label="Quartile (25%)">Quartile (25%)</Select.Item>
							<Select.Item value="H" label="High (30%)">High (30%)</Select.Item>
						</Select.Group>
					</Select.Content>
				</Select.Root>
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

		<CodeEditor class="flex-1 overflow-hidden" language="text" bind:value={input} />
	</section>

	<section class="flex flex-1 flex-col overflow-hidden">
		<header class="mb-6 flex justify-between">
			<h2 class="block text-xl font-bold">Output</h2>

			<ButtonGroup.Root>
				<Button variant="outline" onclick={downloadQRCode}><Download /> Download QR Code</Button>
				<ReferencesSheet
					references={[
						{
							title: 'Online QR Code Generator',
							url: 'https://online-qr-generator.com'
						},
						{
							title: 'MEQR',
							url: 'https://me-qr.com'
						},
						{
							title: 'QR.io',
							url: 'https://qr.io/'
						}
					]}
				/>
			</ButtonGroup.Root>
		</header>
		<div class="flex flex-1 items-center justify-center overflow-hidden border border-gray-300 p-4">
			<div id="qrcode"></div>
		</div>
	</section>
</div>
