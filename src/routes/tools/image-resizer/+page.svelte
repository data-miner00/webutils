<script lang="ts">
	import { Album, ArrowBigRight, Download, EllipsisVertical, Trash2 } from '@lucide/svelte';

	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { BASE64_IDENTIFIER, exampleImageBase64, imageToBase64 } from '$lib/core/base64';
	import { resizeImage } from '$lib/core/image';

	let input = $state('');
	let inputImage = $state('');
	let imageOutput = $state('');
	let height = $state<number | undefined>();
	let width = $state<number | undefined>();
	let maintainAspectRatio = $state(true);

	$effect(() => {
		const fileInput = document.getElementById('fileInput') as HTMLInputElement;
		const selectedFile: File | undefined = fileInput.files?.[0];

		if (input && selectedFile) {
			imageToBase64(selectedFile).then((res) => {
				inputImage = res;
			});
		} else {
			inputImage = '';
		}
	});

	$effect(() => {
		// Todo: This logic is pretty naive and doesn't actually maintain the aspect ratio, just forces width and height to be the same. Should be improved to actually calculate the correct dimensions based on the original image size.
		if (maintainAspectRatio) {
			if (width && !height) {
				height = width;
			} else if (height && !width) {
				width = height;
			} else if (height && width) {
				if (height > width) {
					width = height;
				} else if (width > height) {
					height = width;
				}
			}
		}
	});

	function clearInput() {
		input = '';
	}

	function loadExample1() {
		input = exampleImageBase64;
	}

	function loadExample2() {
		input = exampleImageBase64;
	}

	async function convert() {
		const fileInput = document.getElementById('fileInput') as HTMLInputElement;
		const selectedFile: File | undefined = fileInput.files?.[0];

		if (!selectedFile || !width || !height) {
			return;
		}
		const input = await resizeImage(selectedFile, width, height);
		if (!input.includes(BASE64_IDENTIFIER)) {
			imageOutput = 'data:image/png;base64,' + input;
		} else {
			imageOutput = input;
		}
	}

	function download() {
		const link = document.createElement('a');
		link.href = imageOutput;
		// Todo: Extract file type from base64 string
		link.download = 'image.png';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
</script>

<div class="grid h-full grid-cols-2 gap-4 px-4 py-6">
	<section class="flex flex-1 flex-col overflow-hidden">
		<header class="mb-6 flex justify-between">
			<h1 class="block text-xl font-bold">Resize Image</h1>
			<div class="flex items-center gap-4">
				<div class="flex items-center space-x-2">
					<Switch id="maintain-aspect-ratio" bind:checked={maintainAspectRatio} />
					<Label for="maintain-aspect-ratio">Maintain Aspect Ratio</Label>
				</div>
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
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</ButtonGroup.Root>
					<ButtonGroup.Root>
						<Button size="icon" variant="destructive" onclick={clearInput}><Trash2 /></Button>
					</ButtonGroup.Root>
					<ButtonGroup.Root>
						<Button size="icon" onclick={convert}><ArrowBigRight /></Button>
					</ButtonGroup.Root>
				</ButtonGroup.Root>
			</div>
		</header>
		<div>
			<Input id="fileInput" type="file" bind:value={input} />

			{#if inputImage}
				<div
					class="mt-10 flex items-center justify-center rounded border border-solid border-gray-300 p-8"
				>
					<img src={inputImage} alt="User uploaded" class="block" />
				</div>
			{/if}

			<div class="mt-6 flex items-center gap-4">
				<InputGroup.Root>
					<InputGroup.Addon>
						<InputGroup.Text>Width</InputGroup.Text>
					</InputGroup.Addon>
					<InputGroup.Input placeholder="50" bind:value={width} />
					<InputGroup.Addon align="inline-end">
						<InputGroup.Text>px</InputGroup.Text>
					</InputGroup.Addon>
				</InputGroup.Root>
				<InputGroup.Root>
					<InputGroup.Addon>
						<InputGroup.Text>Height</InputGroup.Text>
					</InputGroup.Addon>
					<InputGroup.Input placeholder="50" bind:value={height} />
					<InputGroup.Addon align="inline-end">
						<InputGroup.Text>px</InputGroup.Text>
					</InputGroup.Addon>
				</InputGroup.Root>
			</div>
		</div>
	</section>

	<section class="flex flex-1 flex-col overflow-hidden">
		<header class="mb-6 flex justify-between">
			<h2 class="block text-xl font-bold">Output</h2>

			<ButtonGroup.Root>
				<Button variant="outline" onclick={download}><Download /> Download</Button>
			</ButtonGroup.Root>
		</header>

		<div
			class="flex flex-1 items-center justify-center rounded-lg border border-solid border-gray-300 p-5"
		>
			<img src={imageOutput} class="block" alt="Decoded base64 output" />
		</div>
	</section>
</div>
