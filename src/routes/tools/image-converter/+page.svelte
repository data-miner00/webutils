<script lang="ts">
	import { BASE64_IDENTIFIER, exampleImageBase64, imageToBase64 } from '$lib/core/base64';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { EllipsisVertical, Trash2, Album, ArrowBigRight, Download } from '@lucide/svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { convertImageFormat, type ImageFormat } from '$lib/core/image';
	import * as Select from '$lib/components/ui/select';

	let input = $state('');
	let inputImage = $state('');
	let imageOutput = $state('');
	let format: ImageFormat = $state('png');

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

		if (!selectedFile) {
			return;
		}
		const input = await convertImageFormat(selectedFile, format);
		if (!input.includes(BASE64_IDENTIFIER)) {
			imageOutput = 'data:image/' + format + ';base64,' + input;
		} else {
			imageOutput = input;
		}
	}

	function download() {
		const link = document.createElement('a');
		link.href = imageOutput;
		// Todo: Extract file type from base64 string
		link.download = 'image.' + format;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
</script>

<div class="mb-4 flex h-screen">
	<section class="flex-1 pr-4">
		<header class="flex justify-between mb-6">
			<h1 class="text-xl font-bold block">Convert Image Format</h1>
			<div class="flex items-center gap-4">
				<Select.Root type="single" name="imageFormat" bind:value={format}>
					<Select.Trigger>
						{format}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Image Format</Select.Label>
							<Select.Item value="png" label="PNG">PNG</Select.Item>
							<Select.Item value="jpeg" label="JPEG">JPEG</Select.Item>
							<Select.Item value="webp" label="WebP">WebP</Select.Item>
							<Select.Item value="bmp" label="BMP">BMP</Select.Item>
						</Select.Group>
					</Select.Content>
				</Select.Root>

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
					class="flex items-center justify-center mt-10 border border-solid border-gray-300 rounded p-8"
				>
					<img src={inputImage} alt="User uploaded" class="block" />
				</div>
			{/if}
		</div>
	</section>

	<section class="flex-1 pl-4">
		<header class="flex justify-between mb-6">
			<h2 class="text-xl font-bold block">Output</h2>

			<ButtonGroup.Root>
				<Button variant="outline" onclick={download}><Download /> Download</Button>
			</ButtonGroup.Root>
		</header>

		<div
			class="flex items-center justify-center p-5 border border-solid border-gray-300 rounded-lg"
		>
			<img src={imageOutput} class="block" alt="Decoded base64 output" />
		</div>
	</section>
</div>
