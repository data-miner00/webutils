<script lang="ts" module>
	declare const QRCode: any;
</script>

<script lang="ts">
	import {
		Album,
		Copy,
		Download,
		EllipsisVertical,
		Eye,
		EyeOff,
		Phone,
		Trash2,
		Wifi
	} from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	import ReferencesSheet from '$lib/components/custom/references/references-sheet.svelte';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as InputGroup from '$lib/components/ui/input-group';
	import * as Label from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import {
		type WifiConfig,
		type WifiSecurity,
		example1,
		example2,
		example3,
		telExample,
		toTelUri,
		toWifiConnectionString,
		wifiExample
	} from '$lib/core/qr-code';

	type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

	const emptyWifi: WifiConfig = { ssid: '', security: 'WPA', password: '', hidden: false };
	const securityLabels: Record<WifiSecurity, string> = {
		WPA: 'WPA/WPA2/WPA3',
		WEP: 'WEP',
		nopass: 'None'
	};

	let errorCorrectionLevel = $state<ErrorCorrectionLevel>('H');
	let mode = $state('text');
	let input = $state('');
	let wifi = $state<WifiConfig>({ ...emptyWifi });
	let isPasswordVisible = $state(false);
	let phoneNumber = $state('');
	let wifiConnectionString = $derived(wifi.ssid ? toWifiConnectionString(wifi) : '');
	let telUri = $derived(phoneNumber.trim() ? toTelUri(phoneNumber) : '');
	let payload = $derived(mode === 'wifi' ? wifiConnectionString : mode === 'tel' ? telUri : input);
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
		if (mode === 'wifi') {
			wifi = { ...emptyWifi };
		} else if (mode === 'tel') {
			phoneNumber = '';
		} else {
			input = '';
		}
	}

	let isLoaded = $state(false);
	const size = 200;

	function generateQRCode(text: string) {
		document.getElementById('qrcode')!.innerHTML = '';
		new QRCode('qrcode', {
			text,
			width: size,
			height: size,
			colorDark: '#000000',
			colorLight: '#ffffff',
			correctLevel: internalErrorCorrectionLevel
		});
	}

	$effect(() => {
		if (isLoaded) {
			generateQRCode(payload || 'hello');
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
		<p class="text-muted-foreground text-center">
			Enter text, Wi-Fi details or a phone number below to generate a QR code.
		</p>
	</header>

	<Tabs.Root bind:value={mode}>
		<Tabs.List>
			<Tabs.Trigger value="text">Text</Tabs.Trigger>
			<Tabs.Trigger value="wifi"><Wifi /> Wi-Fi</Tabs.Trigger>
			<Tabs.Trigger value="tel"><Phone /> Tel</Tabs.Trigger>
		</Tabs.List>

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
						{#if mode === 'wifi'}
							<Button variant="outline" onclick={() => (wifi = { ...wifiExample })}>
								Wi-Fi Example
							</Button>
						{:else if mode === 'tel'}
							<Button variant="outline" onclick={() => (phoneNumber = telExample)}>
								Phone Example
							</Button>
						{:else}
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
						{/if}
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
								},
								{
									title: 'ZXing Wi-Fi Network Config Format',
									url: 'https://github.com/zxing/zxing/wiki/Barcode-Contents#wi-fi-network-config-android-ios-11'
								},
								{
									title: 'RFC 3966: The tel URI for Telephone Numbers',
									url: 'https://www.rfc-editor.org/rfc/rfc3966'
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

		<Tabs.Content value="text">
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
		</Tabs.Content>

		<Tabs.Content value="wifi" class="flex flex-col gap-4">
			<InputGroup.Root>
				<InputGroup.Input
					id="wifi-ssid"
					placeholder="Network name"
					autocomplete="off"
					bind:value={wifi.ssid}
				/>
				<InputGroup.Addon align="block-start">
					<Label.Root for="wifi-ssid" class="text-foreground">SSID</Label.Root>
				</InputGroup.Addon>
			</InputGroup.Root>

			<div class="flex items-center justify-between gap-4">
				<div class="flex items-center gap-2">
					<Label.Root for="wifi-security">Security</Label.Root>
					<Select.Root type="single" name="wifiSecurity" bind:value={wifi.security}>
						<Select.Trigger id="wifi-security">
							{securityLabels[wifi.security]}
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="WPA" label="WPA/WPA2/WPA3">WPA/WPA2/WPA3</Select.Item>
							<Select.Item value="WEP" label="WEP">WEP</Select.Item>
							<Select.Item value="nopass" label="None">None</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>
				<div class="flex items-center gap-2">
					<Checkbox id="wifi-hidden" bind:checked={wifi.hidden} />
					<Label.Root for="wifi-hidden">Hidden network</Label.Root>
				</div>
			</div>

			{#if wifi.security !== 'nopass'}
				<InputGroup.Root>
					<InputGroup.Input
						id="wifi-password"
						type={isPasswordVisible ? 'text' : 'password'}
						placeholder="Network password"
						autocomplete="off"
						bind:value={wifi.password}
					/>
					<InputGroup.Addon align="block-start">
						<Label.Root for="wifi-password" class="text-foreground">Password</Label.Root>
						<InputGroup.Button
							class="ml-auto"
							size="icon-xs"
							aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
							title={isPasswordVisible ? 'Hide password' : 'Show password'}
							onclick={() => (isPasswordVisible = !isPasswordVisible)}
						>
							{#if isPasswordVisible}
								<EyeOff />
							{:else}
								<Eye />
							{/if}
						</InputGroup.Button>
					</InputGroup.Addon>
				</InputGroup.Root>
			{/if}

			<InputGroup.Root>
				<InputGroup.Input
					id="wifi-connection-string"
					class="font-mono"
					placeholder="Enter an SSID to generate the connection string"
					readonly
					value={wifiConnectionString}
				/>
				<InputGroup.Addon align="block-start">
					<Label.Root for="wifi-connection-string" class="text-foreground">
						Connection String
					</Label.Root>
					<InputGroup.Button
						class="ml-auto"
						size="icon-xs"
						aria-label="Copy connection string"
						title="Copy connection string"
						disabled={!wifiConnectionString}
						onclick={() => copyText(wifiConnectionString)}
					>
						<Copy />
					</InputGroup.Button>
				</InputGroup.Addon>
			</InputGroup.Root>
		</Tabs.Content>

		<Tabs.Content value="tel">
			<InputGroup.Root>
				<InputGroup.Input
					id="tel-input"
					type="tel"
					placeholder="e.g. +1 202 555 0100"
					autocomplete="off"
					bind:value={phoneNumber}
				/>
				<InputGroup.Addon align="block-start">
					<Label.Root for="tel-input" class="text-foreground">Phone Number</Label.Root>
				</InputGroup.Addon>
			</InputGroup.Root>
		</Tabs.Content>

		<dir class="border-ring/50 flex flex-col gap-4 rounded-lg border border-solid p-3 pb-12">
			<p class="text-sm">Output</p>

			<div class="mx-auto" id="qrcode"></div>
		</dir>
		<ButtonGroup.Root class="ml-auto">
			<Button onclick={downloadQRCode}>
				<Download /> Download QR Code
			</Button>
		</ButtonGroup.Root>
	</Tabs.Root>
</div>
