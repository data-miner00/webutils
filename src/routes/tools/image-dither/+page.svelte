<script lang="ts">
	import { Download, Trash2 } from '@lucide/svelte';
	import { onDestroy } from 'svelte';

	import ReferencesSheet from '$lib/components/custom/references/references-sheet.svelte';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select';
	import { Slider } from '$lib/components/ui/slider/index.js';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { exampleImageBase64 } from '$lib/core/base64';
	import {
		type DitherAlgorithm,
		type Rgb,
		ditherAlgorithms,
		extractPalette,
		hexToRgb,
		palettePresets,
		parseHexPalette,
		rgbToHex
	} from '$lib/core/dither';
	import type { DitherRequest, DitherResponse } from '$lib/workers/dither.worker';
	import DitherWorker from '$lib/workers/dither.worker?worker';

	const IMAGE_PALETTE = 'image';
	const CUSTOM_PALETTE = 'custom';
	// Wait for slider drags and typing to settle before starting a new job
	const DEBOUNCE_MS = 150;
	const MIN_COLORS = 2;
	const MAX_COLORS = 32;
	const MIN_PIXEL_SIZE = 1;
	const MAX_PIXEL_SIZE = 16;

	const algorithmGroups = [...new Set(ditherAlgorithms.map((option) => option.group))];
	const paletteOptions = [
		...palettePresets.map(({ id, name }) => ({ id, name })),
		{ id: IMAGE_PALETTE, name: 'From image' },
		{ id: CUSTOM_PALETTE, name: 'Custom' }
	];

	let fileValue = $state('');
	let fileName = $state('image');
	let originalUrl = $state('');
	let loadError = $state('');
	let image = $state.raw<ImageBitmap | null>(null);

	let algorithm = $state<DitherAlgorithm>('floyd-steinberg');
	let paletteId = $state('black-white');
	let colorCount = $state(8);
	let customColors = $state('#000000, #ff0000, #ffffff');
	let pixelSize = $state(2);

	let output = $state.raw<ImageData | null>(null);
	let outputPixelSize = $state(1);
	let isProcessing = $state(false);
	let previewWidth = $state(0);

	let sourcePixels = $derived(image ? readPixels(image, pixelSize) : null);
	let customPalette = $derived.by(() => {
		try {
			return { colors: parseHexPalette(customColors), error: '' };
		} catch (error) {
			return { colors: [], error: error instanceof Error ? error.message : String(error) };
		}
	});
	let palette = $derived.by((): Rgb[] => {
		if (paletteId === CUSTOM_PALETTE) return customPalette.colors;
		if (paletteId === IMAGE_PALETTE) {
			return sourcePixels ? extractPalette(sourcePixels, colorCount) : [];
		}
		return palettePresets.find((preset) => preset.id === paletteId)?.colors.map(hexToRgb) ?? [];
	});
	let algorithmName = $derived(ditherAlgorithms.find((option) => option.id === algorithm)?.name);
	let paletteName = $derived(paletteOptions.find((option) => option.id === paletteId)?.name);
	let isUpscaled = $derived(output !== null && previewWidth > output.width);

	const worker = new DitherWorker();
	let latestJob = 0;
	let latestPixelSize = 1;

	worker.onmessage = (event: MessageEvent<DitherResponse>) => {
		const { id, width, height, buffer } = event.data;
		// A newer job has started since this one, so its result is already out of date
		if (id !== latestJob) return;

		output = new ImageData(new Uint8ClampedArray(buffer), width, height);
		outputPixelSize = latestPixelSize;
		isProcessing = false;
	};

	$effect(() => {
		const pixels = sourcePixels;
		const colors = palette;
		const selectedAlgorithm = algorithm;
		const size = pixelSize;
		if (!pixels || !colors.length) return;

		const timeout = setTimeout(() => {
			latestJob++;
			latestPixelSize = size;
			isProcessing = true;

			// Send a copy so the source pixels can be reused for the next job
			const buffer = pixels.data.slice().buffer;
			const request: DitherRequest = {
				id: latestJob,
				width: pixels.width,
				height: pixels.height,
				buffer,
				palette: colors,
				algorithm: selectedAlgorithm
			};
			worker.postMessage(request, [buffer]);
		}, DEBOUNCE_MS);

		return () => clearTimeout(timeout);
	});

	onDestroy(() => {
		worker.terminate();
		image?.close();
		setOriginalUrl('');
	});

	// Redraws the preview canvas whenever a new result arrives
	function drawPixels(pixels: ImageData) {
		return (canvas: HTMLCanvasElement) => {
			canvas.width = pixels.width;
			canvas.height = pixels.height;
			canvas.getContext('2d')?.putImageData(pixels, 0, 0);
		};
	}

	// Shrinking the image by the pixel size averages each block into a single dot
	function readPixels(bitmap: ImageBitmap, size: number): ImageData {
		const canvas = document.createElement('canvas');
		canvas.width = Math.max(1, Math.ceil(bitmap.width / size));
		canvas.height = Math.max(1, Math.ceil(bitmap.height / size));

		const context = canvas.getContext('2d', { willReadFrequently: true })!;
		context.imageSmoothingQuality = 'high';
		context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
		return context.getImageData(0, 0, canvas.width, canvas.height);
	}

	function setOriginalUrl(url: string) {
		if (originalUrl.startsWith('blob:')) {
			URL.revokeObjectURL(originalUrl);
		}
		originalUrl = url;
	}

	async function loadImage(file: Blob, name: string) {
		try {
			const bitmap = await createImageBitmap(file);
			image?.close();
			image = bitmap;
			fileName = name.replace(/\.[^.]+$/, '') || 'image';
			setOriginalUrl(URL.createObjectURL(file));
			loadError = '';
		} catch {
			loadError = 'This file could not be read as an image.';
		}
	}

	function onFileChange(event: Event & { currentTarget: HTMLInputElement }) {
		const file = event.currentTarget.files?.[0];
		if (file) {
			loadImage(file, file.name);
		}
	}

	async function loadExample() {
		const blob = await (await fetch(exampleImageBase64)).blob();
		fileValue = '';
		await loadImage(blob, 'example');
	}

	function clear() {
		// Ignore any job that is still running
		latestJob++;
		image?.close();
		image = null;
		output = null;
		isProcessing = false;
		fileValue = '';
		loadError = '';
		setOriginalUrl('');
	}

	function download() {
		if (!output || !image) return;

		const dots = document.createElement('canvas');
		dots.width = output.width;
		dots.height = output.height;
		dots.getContext('2d')?.putImageData(output, 0, 0);

		const canvas = document.createElement('canvas');
		canvas.width = image.width;
		canvas.height = image.height;
		const context = canvas.getContext('2d')!;
		// Scale by whole pixels without smoothing so every dot stays a crisp square
		context.imageSmoothingEnabled = false;
		context.drawImage(dots, 0, 0, output.width * outputPixelSize, output.height * outputPixelSize);

		canvas.toBlob((blob) => {
			if (!blob) return;

			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `${fileName}-dithered.png`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		}, 'image/png');
	}
</script>

<div class="grid h-full grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-2">
	<section class="flex min-w-0 flex-col gap-6">
		<header class="flex flex-wrap items-center justify-between gap-4">
			<h1 class="text-xl font-bold">Image Dither</h1>
			<ButtonGroup.Root>
				<ButtonGroup.Root>
					<Button variant="outline" onclick={loadExample}>Example</Button>
					<ReferencesSheet
						references={[
							{
								title: 'Dither - Wikipedia',
								url: 'https://en.wikipedia.org/wiki/Dither'
							},
							{
								title: 'Ditherpunk: the article I wish I had about monochrome image dithering',
								url: 'https://surma.dev/things/ditherpunk/'
							},
							{
								title: 'Image Dithering: Eleven Algorithms and Source Code',
								url: 'https://tannerhelland.com/2012/12/28/dithering-eleven-algorithms-source-code.html'
							}
						]}
					/>
				</ButtonGroup.Root>
				<ButtonGroup.Root>
					<Button size="icon" variant="destructive" aria-label="Clear image" onclick={clear}>
						<Trash2 />
					</Button>
				</ButtonGroup.Root>
			</ButtonGroup.Root>
		</header>

		<div>
			<Label for="image-file" class="mb-3 font-bold">Image</Label>
			<Input
				id="image-file"
				type="file"
				accept="image/*"
				bind:value={fileValue}
				onchange={onFileChange}
			/>
			{#if loadError}
				<p class="text-destructive mt-2 text-sm">{loadError}</p>
			{/if}
		</div>

		<div class="grid gap-4 sm:grid-cols-2">
			<div>
				<Label for="algorithm" class="mb-3 font-bold">Algorithm</Label>
				<Select.Root type="single" name="algorithm" bind:value={algorithm}>
					<Select.Trigger id="algorithm" class="w-full">{algorithmName}</Select.Trigger>
					<Select.Content>
						{#each algorithmGroups as group (group)}
							<Select.Group>
								<Select.Label>{group}</Select.Label>
								{#each ditherAlgorithms.filter((option) => option.group === group) as option (option.id)}
									<Select.Item value={option.id} label={option.name}>{option.name}</Select.Item>
								{/each}
							</Select.Group>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<div>
				<Label for="palette" class="mb-3 font-bold">Palette</Label>
				<Select.Root type="single" name="palette" bind:value={paletteId}>
					<Select.Trigger id="palette" class="w-full">{paletteName}</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Palette</Select.Label>
							{#each paletteOptions as option (option.id)}
								<Select.Item value={option.id} label={option.name}>{option.name}</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>
		</div>

		{#if paletteId === IMAGE_PALETTE}
			<div>
				<div class="mb-3 flex items-center justify-between">
					<span class="text-sm font-bold">Colors</span>
					<span class="text-muted-foreground text-sm">{colorCount}</span>
				</div>
				<Slider type="single" bind:value={colorCount} min={MIN_COLORS} max={MAX_COLORS} step={1} />
				<div class="text-muted-foreground mt-2 flex justify-between text-xs">
					<span>{MIN_COLORS}</span>
					<span>{MAX_COLORS}</span>
				</div>
			</div>
		{:else if paletteId === CUSTOM_PALETTE}
			<div>
				<Label for="custom-colors" class="mb-3 font-bold">Colors</Label>
				<Input
					id="custom-colors"
					class="font-mono"
					placeholder="#000000, #ff0000, #ffffff"
					autocomplete="off"
					spellcheck="false"
					aria-invalid={customPalette.error !== ''}
					aria-describedby="custom-colors-hint"
					bind:value={customColors}
				/>
				<p
					id="custom-colors-hint"
					class="mt-2 text-sm {customPalette.error ? 'text-destructive' : 'text-muted-foreground'}"
				>
					{customPalette.error || 'Hex colors separated by commas or spaces'}
				</p>
			</div>
		{/if}

		{#if palette.length}
			<div>
				<p class="mb-3 text-sm font-bold">Palette colors</p>
				<div class="flex flex-wrap gap-1">
					{#each palette as color, index (index)}
						<span
							class="size-6 rounded border"
							style:background-color={rgbToHex(color)}
							title={rgbToHex(color)}
						></span>
					{/each}
				</div>
			</div>
		{/if}

		<div>
			<div class="mb-3 flex items-center justify-between">
				<span class="text-sm font-bold">Pixel size</span>
				<span class="text-muted-foreground text-sm">{pixelSize}×</span>
			</div>
			<Slider
				type="single"
				bind:value={pixelSize}
				min={MIN_PIXEL_SIZE}
				max={MAX_PIXEL_SIZE}
				step={1}
			/>
			<div class="text-muted-foreground mt-2 flex justify-between text-xs">
				<span>{MIN_PIXEL_SIZE}×</span>
				<span>{MAX_PIXEL_SIZE}×</span>
			</div>
		</div>

		{#if originalUrl}
			<div class="rounded-lg border border-solid p-4">
				<p class="mb-3 text-sm font-medium">Original</p>
				<img src={originalUrl} alt="Original upload" class="mx-auto block max-h-96 max-w-full" />
			</div>
		{/if}
	</section>

	<section class="flex min-w-0 flex-col gap-6">
		<header class="flex items-center justify-between gap-4">
			<h2 class="text-xl font-bold">Output</h2>
			<div class="flex items-center gap-3">
				{#if isProcessing}
					<Spinner />
				{/if}
				<Button variant="outline" disabled={!output} onclick={download}>
					<Download /> Download
				</Button>
			</div>
		</header>

		<div
			bind:clientWidth={previewWidth}
			class="flex min-h-64 flex-1 items-center justify-center rounded-lg border border-solid p-4"
		>
			{#if output}
				<canvas
					{@attach drawPixels(output)}
					class="block max-h-[70vh] w-full object-contain {isUpscaled
						? '[image-rendering:pixelated]'
						: ''}"
				></canvas>
			{:else}
				<p class="text-muted-foreground text-sm">
					Upload an image or load the example to see it dithered.
				</p>
			{/if}
		</div>
	</section>
</div>
