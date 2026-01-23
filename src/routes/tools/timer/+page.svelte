<script lang="ts">
	import { onDestroy } from 'svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Settings } from '@lucide/svelte';

	// initial duration in minutes
	const DEFAULT_MINUTES = 15;

	let initialMinutes: number = DEFAULT_MINUTES;
	let remainingSeconds: number = initialMinutes * 60;
	let timerId: number | null = null;
	let running = false;

	function formatTime(seconds: number) {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
	}

	function start() {
		if (running) return;
		if (remainingSeconds <= 0) remainingSeconds = initialMinutes * 60;
		running = true;
		timerId = window.setInterval(() => {
			if (remainingSeconds > 0) {
				remainingSeconds -= 1;
			}
			if (remainingSeconds <= 0) {
				pause();
			}
		}, 1000) as unknown as number;
	}

	function pause() {
		running = false;
		if (timerId !== null) {
			clearInterval(timerId);
			timerId = null;
		}
	}

	function reset() {
		pause();
		remainingSeconds = initialMinutes * 60;
	}

	onDestroy(() => {
		pause();
	});
</script>

<article class="flex flex-col p-4 text-center w-fit mx-auto my-48">
	<div class="flex justify-between">
		<div>Timer</div>
		<Button variant="ghost">
			<Settings />
		</Button>
	</div>
	<div class="text-9xl font-black mb-4">{formatTime(remainingSeconds)}</div>
	<div class="flex gap-1">
		<Button onclick={start} disabled={running}>Start</Button>
		<Button variant="outline" onclick={pause} disabled={!running}>Pause</Button>
		<Button variant="ghost" onclick={reset}>Reset</Button>
	</div>
</article>
