<script lang="ts">
	import { onDestroy } from 'svelte';

	import Button from '$lib/components/ui/button/button.svelte';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as NativeSelect from '$lib/components/ui/native-select/index.js';

	let mode = $state('timer');

	// Timer variables
	let initialHours = $state(0);
	let initialMinutes = $state(15);
	let initialSeconds = $state(0);
	let remainingSeconds = $derived(initialHours * 3600 + initialMinutes * 60 + initialSeconds);
	let countdownSeconds = $state(0);
	let timerId = $state<number | null>(null);
	let timerRunning = $state(false);

	// Stopwatch variables
	let elapsedSeconds = $state(0);
	let stopwatchId = $state<number | null>(null);
	let stopwatchRunning = $state(false);

	function formatTime(seconds: number) {
		const h = Math.floor(seconds / 3600);
		const m = Math.floor((seconds % 3600) / 60);
		const s = seconds % 60;
		if (h > 0) {
			return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
		} else {
			return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
		}
	}

	function startTimer() {
		if (timerRunning) return;
		countdownSeconds = remainingSeconds;
		if (countdownSeconds <= 0) countdownSeconds = remainingSeconds;
		timerRunning = true;
		timerId = window.setInterval(() => {
			if (countdownSeconds > 0) {
				countdownSeconds -= 1;
			}
			if (countdownSeconds <= 0) {
				pauseTimer();
			}
		}, 1000);
	}

	function pauseTimer() {
		timerRunning = false;
		if (timerId !== null) {
			clearInterval(timerId);
			timerId = null;
		}
	}

	function resetTimer() {
		pauseTimer();
		countdownSeconds = remainingSeconds;
	}

	function startStopwatch() {
		if (stopwatchRunning) return;
		stopwatchRunning = true;
		stopwatchId = window.setInterval(() => {
			elapsedSeconds += 1;
		}, 1000);
	}

	function stopStopwatch() {
		stopwatchRunning = false;
		if (stopwatchId !== null) {
			clearInterval(stopwatchId);
			stopwatchId = null;
		}
	}

	function resetStopwatch() {
		stopStopwatch();
		elapsedSeconds = 0;
	}

	onDestroy(() => {
		pauseTimer();
		stopStopwatch();
	});
</script>

<article class="mx-auto my-24 flex w-fit flex-col p-4 text-center">
	<div class="mb-4 flex justify-center gap-2">
		<Button variant={mode === 'timer' ? 'default' : 'outline'} onclick={() => (mode = 'timer')}
			>Timer</Button
		>
		<Button
			variant={mode === 'stopwatch' ? 'default' : 'outline'}
			onclick={() => (mode = 'stopwatch')}>Stopwatch</Button
		>
	</div>

	{#if mode === 'timer'}
		{#if !timerRunning}
			<div class="mb-4 flex justify-center gap-2">
				<Label for="hours">Hours</Label>
				<NativeSelect.Root id="hours" name="hours" bind:value={initialHours}>
					{#each Array.from({ length: 24 }, (_, i) => i) as hour}
						<NativeSelect.Option value={hour}>{hour}</NativeSelect.Option>
					{/each}
				</NativeSelect.Root>
				<Label for="minutes">Minutes</Label>
				<NativeSelect.Root id="minutes" name="minutes" bind:value={initialMinutes}>
					{#each Array.from({ length: 60 }, (_, i) => i) as minute}
						<NativeSelect.Option value={minute}>{minute}</NativeSelect.Option>
					{/each}
				</NativeSelect.Root>
				<Label for="seconds">Seconds</Label>
				<NativeSelect.Root id="seconds" name="seconds" bind:value={initialSeconds}>
					{#each Array.from({ length: 60 }, (_, i) => i) as second}
						<NativeSelect.Option value={second}>{second}</NativeSelect.Option>
					{/each}
				</NativeSelect.Root>
			</div>
		{/if}
		<div class="mb-4 text-9xl font-black">{formatTime(countdownSeconds)}</div>
		<div class="flex justify-center gap-1">
			<Button onclick={startTimer} disabled={timerRunning}>Start</Button>
			<Button variant="outline" onclick={pauseTimer} disabled={!timerRunning}>Pause</Button>
			<Button variant="ghost" onclick={resetTimer}>Reset</Button>
		</div>
	{:else}
		<div class="mb-4 text-9xl font-black">{formatTime(elapsedSeconds)}</div>
		<div class="flex justify-center gap-1">
			<Button onclick={startStopwatch} disabled={stopwatchRunning}>Start</Button>
			<Button variant="outline" onclick={stopStopwatch} disabled={!stopwatchRunning}>Stop</Button>
			<Button variant="ghost" onclick={resetStopwatch}>Reset</Button>
		</div>
	{/if}
</article>
