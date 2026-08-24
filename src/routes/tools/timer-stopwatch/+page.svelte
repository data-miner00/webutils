<script lang="ts">
	import { PauseIcon, PlayIcon, RefreshCwIcon, SquareIcon } from '@lucide/svelte';
	import { onDestroy } from 'svelte';

	import Button from '$lib/components/ui/button/button.svelte';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as NativeSelect from '$lib/components/ui/native-select/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';

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
				for (let i = 0; i < 3; i++) {
					setTimeout(() => beep(), i * 500);
				}
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

	// @ts-ignore
	const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

	function beep(duration = 200, frequency = 440, volume = 10) {
		// Create nodes
		const oscillator = audioCtx.createOscillator();
		const gainNode = audioCtx.createGain();

		// Connect nodes to speakers
		oscillator.connect(gainNode);
		gainNode.connect(audioCtx.destination);

		// Configure settings
		oscillator.type = 'sine'; // Choices: 'sine', 'square', 'sawtooth', 'triangle'
		oscillator.frequency.value = frequency; // Frequency in Hz (440 is the 'A' note)
		gainNode.gain.value = volume * 0.01; // Scale volume down

		// Start and auto-stop
		oscillator.start(audioCtx.currentTime);
		oscillator.stop(audioCtx.currentTime + duration / 1000);
	}

	onDestroy(() => {
		pauseTimer();
		stopStopwatch();
	});
</script>

<div class="relative h-full p-6">
	<Tabs.Root value="timer">
		<Tabs.List>
			<Tabs.Trigger value="timer">Timer</Tabs.Trigger>
			<Tabs.Trigger value="stopwatch">Stopwatch</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="timer" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
			{#if !timerRunning}
				<div class="mb-4 flex justify-center gap-2">
					<NativeSelect.Root id="hours" name="hours" bind:value={initialHours}>
						{#each Array.from({ length: 24 }, (_, i) => i) as hour}
							<NativeSelect.Option value={hour}>{hour}</NativeSelect.Option>
						{/each}
					</NativeSelect.Root>
					<Label for="hours">Hours</Label>
					<NativeSelect.Root id="minutes" name="minutes" bind:value={initialMinutes}>
						{#each Array.from({ length: 60 }, (_, i) => i) as minute}
							<NativeSelect.Option value={minute}>{minute}</NativeSelect.Option>
						{/each}
					</NativeSelect.Root>
					<Label for="minutes">Minutes</Label>
					<NativeSelect.Root id="seconds" name="seconds" bind:value={initialSeconds}>
						{#each Array.from({ length: 60 }, (_, i) => i) as second}
							<NativeSelect.Option value={second}>{second}</NativeSelect.Option>
						{/each}
					</NativeSelect.Root>
					<Label for="seconds">Seconds</Label>
				</div>
			{/if}
			<div class="mb-4 text-center text-9xl font-bold">{formatTime(countdownSeconds)}</div>
			<div class="flex justify-center gap-1">
				<Button onclick={startTimer} disabled={timerRunning}><PlayIcon /> Start</Button>
				<Button variant="outline" onclick={pauseTimer} disabled={!timerRunning}
					><PauseIcon /> Pause</Button
				>
				<Button variant="ghost" onclick={resetTimer}><RefreshCwIcon /> Reset</Button>
			</div>
		</Tabs.Content>
		<Tabs.Content
			value="stopwatch"
			class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
		>
			<div class="mb-4 text-center text-9xl font-bold">{formatTime(elapsedSeconds)}</div>
			<div class="flex justify-center gap-1">
				<Button onclick={startStopwatch} disabled={stopwatchRunning}><PlayIcon /> Start</Button>
				<Button variant="outline" onclick={stopStopwatch} disabled={!stopwatchRunning}
					><SquareIcon /> Stop</Button
				>
				<Button variant="ghost" onclick={resetStopwatch}><RefreshCwIcon /> Reset</Button>
			</div>
		</Tabs.Content>
	</Tabs.Root>
</div>

<!-- Setting 1: Select or Input for timer duration (hours, minutes, seconds)
Setting 2: Display format (HH:MM:SS or MM:SS)

Fix 1: The timer cannot resume after being paused -->
