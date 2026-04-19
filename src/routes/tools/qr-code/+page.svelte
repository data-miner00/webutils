<script lang="ts" module>
	declare const QRCode: any;
</script>

<script lang="ts">
	import { Album, Download, EllipsisVertical, Trash2 } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	import ReferencesSheet from '$lib/components/custom/references/references-sheet.svelte';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as InputGroup from '$lib/components/ui/input-group';
	import * as Label from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select';
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

			toast.success('QR code downloaded successfully!');
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

<div class="mx-auto mt-10 max-w-xl">
	<header class="mb-20">
		<h1 class="block text-center text-xl font-bold">Simple QR Code Generator</h1>
		<p class="text-muted-foreground text-center">Enter text below to generate a QR code.</p>
	</header>

	<div class="flex flex-col gap-6 rounded-lg border border-solid border-gray-300 p-8">
		<div class="flex justify-end">
			<div class="flex items-center gap-2">
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
						<Button variant="outline" onclick={() => (input = example1)}>Http Url Example</Button>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								{#snippet child({ props })}
									<Button {...props} variant="outline" aria-label="More examples">
										<EllipsisVertical />
									</Button>
								{/snippet}
							</DropdownMenu.Trigger>
							<DropdownMenu.Content align="end" class="w-52">
								<DropdownMenu.Group>
									<DropdownMenu.Item onclick={() => (input = example2)}>
										<Album />
										Random UUID Example
									</DropdownMenu.Item>
									<DropdownMenu.Item onclick={() => (input = example3)}>
										<Album />
										Text Example
									</DropdownMenu.Item>
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
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
					<ButtonGroup.Root>
						<Button size="icon" variant="destructive" onclick={clearInput}><Trash2 /></Button>
					</ButtonGroup.Root>
				</ButtonGroup.Root>
			</div>
		</div>

		<InputGroup.Root>
			<InputGroup.Input
				id="qr-input"
				placeholder="Enter text to generate QR code"
				bind:value={input}
			/>
			<InputGroup.Addon align="block-start">
				<Label.Root for="qr-input" class="text-foreground">Input</Label.Root>
			</InputGroup.Addon>
		</InputGroup.Root>

		<dir class="border-ring/50 flex flex-col gap-4 rounded-lg border border-solid p-3 pb-12">
			<p class="text-sm">Output</p>

			<div class="mx-auto" id="qrcode"></div>
		</dir>
		<ButtonGroup.Root class="ml-auto">
			<Button onclick={downloadQRCode}>
				<Download /> Download QR Code
			</Button>
		</ButtonGroup.Root>
	</div>
</div>
