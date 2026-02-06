<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import {
		Trash2,
		Download,
		Redo,
		Undo,
		Brush,
		Eraser,
		Circle,
		PaintBucket,
		Square
	} from '@lucide/svelte';

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

<header class="flex justify-between mb-6">
	<h1 class="text-xl font-bold block">Drawing</h1>
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
	class="border-2 border-solid border-gray-300 cursor-crosshair bg-white"
	onmousedown={startDrawing}
	onmousemove={draw}
	onmouseup={stopDrawing}
	onmouseleave={stopDrawing}
></canvas>
