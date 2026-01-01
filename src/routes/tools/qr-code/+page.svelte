<script lang="ts" module>
	declare const QRCode: any;
</script>

<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';

	let qrcode;
	let isLoaded = $state(false);
	let text = $state('');
	const size = 200;

	function generateQRCode() {
		document.querySelectorAll('#qrcode > img').forEach((imgElem) => imgElem.remove());
		qrcode = new QRCode('qrcode', {
			text,
			width: size,
			height: size,
			colorDark: '#000000',
			colorLight: '#ffffff',
			correctLevel: QRCode.CorrectLevel.H
		});
	}

	$effect(() => {
		isLoaded && text && generateQRCode();
	});
</script>

<!-- Doing this is not offline-guaranteed. Need to download and self host instead  -->
<svelte:head>
	<script
		src="https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js"
		onload={() => (isLoaded = true)}
	></script>
</svelte:head>

<h1 class="text-3xl font-bold mb-4">QR Code Generator</h1>

<Input bind:value={text} placeholder="Your text here..." />

<div id="qrcode" class="mt-10"></div>
