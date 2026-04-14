<script lang="ts">
	import {
		Brush,
		Circle,
		Download,
		Eraser,
		PaintBucket,
		Redo,
		Square,
		Trash2,
		Undo
	} from '@lucide/svelte';

	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	let canvas: HTMLCanvasElement | undefined;
	let isDrawing = $state(false);
	let context = $state<CanvasRenderingContext2D | null>(null);

	function startDrawing(e: MouseEvent): void {
		isDrawing = true;
		const rect = canvas!.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		context!.beginPath();
		context!.moveTo(x, y);
	}

	function draw(e: MouseEvent): void {
		if (!isDrawing) return;

		const rect = canvas!.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		context!.lineTo(x, y);
		context!.stroke();
	}

	function stopDrawing(): void {
		isDrawing = false;
		context!.closePath();
	}

	function clearCanvas(): void {
		context!.clearRect(0, 0, canvas!.width, canvas!.height);
	}

	// Initialize canvas when component mounts
	$effect(() => {
		if (canvas) {
			context = canvas.getContext('2d');
			if (context) {
				context.lineWidth = 2;
				context.lineCap = 'round';
				context.lineJoin = 'round';
				context.strokeStyle = '#000000';
			}
		}
	});
</script>

<div class="px-4 py-6">
	<header class="mb-6 flex justify-between">
		<h1 class="block text-xl font-bold">Drawing</h1>
		<div class="flex items-center gap-4">
			<ButtonGroup.Root>
				<ButtonGroup.Root>
					<Button size="icon" variant="outline">
						<Brush />
					</Button>
					<Button size="icon" variant="outline">
						<Eraser />
					</Button>
					<Button size="icon" variant="outline">
						<Square />
					</Button>
					<Button size="icon" variant="outline">
						<Circle />
					</Button>
					<Button size="icon" variant="outline">
						<PaintBucket />
					</Button>
				</ButtonGroup.Root>
				<!-- <ButtonGroup.Root>
				<Button size="icon" variant="outline" class="bg-black-400"></Button>
				<Button size="icon" variant="outline" class="bg-red-400"></Button>
				<Button size="icon" variant="outline" class="bg-blue-400"></Button>
			</ButtonGroup.Root> -->
				<ButtonGroup.Root>
					<Button size="icon" variant="outline" onclick={() => {}}><Undo /></Button>
					<Button size="icon" variant="outline" onclick={() => {}}><Redo /></Button>
					<Button size="icon" variant="outline" onclick={() => {}}><Download /></Button>
				</ButtonGroup.Root>
				<ButtonGroup.Root>
					<Button size="icon" variant="destructive" onclick={clearCanvas}><Trash2 /></Button>
				</ButtonGroup.Root>
			</ButtonGroup.Root>
		</div>
	</header>

	<canvas
		bind:this={canvas}
		width={1400}
		height={800}
		class="cursor-crosshair border-2 border-solid border-gray-300 bg-white"
		onmousedown={startDrawing}
		onmousemove={draw}
		onmouseup={stopDrawing}
		onmouseleave={stopDrawing}
	></canvas>
</div>
