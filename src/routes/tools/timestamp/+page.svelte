<script lang="ts">
	import { Clipboard, Trash2 } from '@lucide/svelte';
	import { onMount } from 'svelte';

	import ReferencesSheet from '$lib/components/custom/references/references-sheet.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import * as InputGroup from '$lib/components/ui/input-group';
	import * as Label from '$lib/components/ui/label/index.js';
	import * as NativeSelect from '$lib/components/ui/native-select/index.js';
	import { copyText } from '$lib/core/copy-to-clipboard';

	let timestamp = $state(Math.floor(Date.now() / 1000));
	let timestampMode = $state<'second' | 'millisecond'>('second');
	let format = $state<'locale' | 'iso'>('locale');

	onMount(() => {
		const interval = setInterval(() => {
			if (timestampMode === 'second') {
				timestamp = Math.floor(Date.now() / 1000);
			} else {
				timestamp = Date.now();
			}
		}, 1000);

		return () => clearInterval(interval);
	});

	function copyTimestamp() {
		copyText(timestamp.toString());
	}

	let inputTimestamp = $state('');
	let inputDate = $state('');

	let convertedDate = $derived.by(() => {
		if (inputTimestamp) {
			const ts = parseInt(inputTimestamp);
			if (isNaN(ts)) return 'Invalid timestamp';
			const date = new Date(timestampMode === 'second' ? ts * 1000 : ts);
			if (format === 'iso') {
				return date.toISOString();
			} else {
				return date.toLocaleString();
			}
		}
		return '';
	});

	let convertedTimestamp = $derived.by(() => {
		if (inputDate) {
			const date = new Date(inputDate);
			if (isNaN(date.getTime())) return 'Invalid date';
			if (timestampMode === 'second') {
				return Math.floor(date.getTime() / 1000);
			} else {
				return date.getTime();
			}
		}
		return '';
	});

	function clearTimestampInput() {
		inputTimestamp = '';
	}

	function clearDateInput() {
		inputDate = '';
	}

	function copyConvertedDate() {
		if (convertedDate && convertedDate !== 'Invalid timestamp') copyText(convertedDate);
	}

	function copyConvertedTimestamp() {
		if (convertedTimestamp && typeof convertedTimestamp === 'number')
			copyText(convertedTimestamp.toString());
	}

	function setCurrentTimestamp() {
		inputTimestamp = timestamp.toString();
	}

	function setEpoch() {
		inputTimestamp = '0';
	}

	function setCurrentDate() {
		const now = new Date();
		inputDate = now.toISOString().slice(0, 16); // for datetime-local
	}
</script>

<div class="mx-auto mt-10 max-w-xl">
	<header class="mb-20">
		<h1 class="block text-center text-xl font-bold">Timestamp Converter</h1>
		<p class="text-muted-foreground text-center">
			Convert between timestamps and human-readable dates.
		</p>
	</header>

	<div class="flex flex-col gap-6 rounded-lg border border-solid border-gray-300 p-8">
		<!-- Current Timestamp Section -->
		<div class="border-ring/50 flex flex-col gap-4 rounded-lg border border-solid p-3">
			<p class="text-sm font-medium">Current Timestamp</p>
			<div class="relative flex items-center justify-center gap-2">
				<span class="text-2xl">{timestamp}</span>
				<ButtonGroup.Root class="absolute -top-1 right-0">
					<Button variant="outline" size="icon" onclick={copyTimestamp}><Clipboard /></Button>
					<ReferencesSheet
						references={[
							{
								title: 'Epoch Converter',
								url: 'https://www.epochconverter.com/'
							},
							{
								title: 'Unix Timestamp',
								url: 'https://unixtimestamp.com/'
							}
						]}
					/>
				</ButtonGroup.Root>
			</div>
			<div class="flex gap-2">
				<NativeSelect.Root bind:value={timestampMode}>
					<NativeSelect.Option value="second">Seconds</NativeSelect.Option>
					<NativeSelect.Option value="millisecond">Milliseconds</NativeSelect.Option>
				</NativeSelect.Root>
				<NativeSelect.Root bind:value={format}>
					<NativeSelect.Option value="locale">Locale</NativeSelect.Option>
					<NativeSelect.Option value="iso">ISO</NativeSelect.Option>
				</NativeSelect.Root>
			</div>
		</div>

		<!-- Timestamp to Date -->
		<div class="border-ring/50 flex flex-col gap-4 rounded-lg border border-solid p-3">
			<div class="flex items-center justify-between">
				<p class="text-sm font-medium">Timestamp to Date</p>
				<ButtonGroup.Root>
					<Button variant="outline" size="sm" onclick={setCurrentTimestamp}>Now</Button>
					<Button variant="outline" size="sm" onclick={setEpoch}>Epoch</Button>
					<Button variant="outline" size="sm" onclick={clearTimestampInput}><Trash2 /></Button>
				</ButtonGroup.Root>
			</div>
			<InputGroup.Root>
				<InputGroup.Input placeholder="Enter timestamp" bind:value={inputTimestamp} />
				<InputGroup.Addon>
					<Label.Root>Timestamp</Label.Root>
				</InputGroup.Addon>
			</InputGroup.Root>
			{#if convertedDate}
				<div class="bg-muted flex items-center justify-between rounded p-2">
					<span class="text-sm">{convertedDate}</span>
					<Button variant="outline" size="icon" onclick={copyConvertedDate}><Clipboard /></Button>
				</div>
			{/if}
		</div>

		<!-- Date to Timestamp -->
		<div class="border-ring/50 flex flex-col gap-4 rounded-lg border border-solid p-3">
			<div class="flex items-center justify-between">
				<p class="text-sm font-medium">Date to Timestamp</p>
				<ButtonGroup.Root>
					<Button variant="outline" size="sm" onclick={setCurrentDate}>Now</Button>
					<Button variant="outline" size="sm" onclick={clearDateInput}><Trash2 /></Button>
				</ButtonGroup.Root>
			</div>
			<InputGroup.Root>
				<InputGroup.Input type="datetime-local" bind:value={inputDate} />
				<InputGroup.Addon>
					<Label.Root>Date & Time</Label.Root>
				</InputGroup.Addon>
			</InputGroup.Root>
			{#if convertedTimestamp !== ''}
				<div class="bg-muted flex items-center justify-between rounded p-2">
					<span class="text-sm">{convertedTimestamp}</span>
					<Button variant="outline" size="icon" onclick={copyConvertedTimestamp}
						><Clipboard /></Button
					>
				</div>
			{/if}
		</div>
	</div>
</div>
