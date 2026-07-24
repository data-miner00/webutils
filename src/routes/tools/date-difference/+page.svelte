<script lang="ts">
	import { ArrowLeftRight, Clipboard } from '@lucide/svelte';

	import { Button } from '$lib/components/ui/button';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import * as InputGroup from '$lib/components/ui/input-group';
	import * as Label from '$lib/components/ui/label/index.js';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import { calculateDateDifference } from '$lib/core/date-difference';

	function nowLocal(): string {
		const now = new Date();
		now.setSeconds(0, 0);
		now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
		return now.toISOString().slice(0, 16);
	}

	let startDate = $state(nowLocal());
	let endDate = $state(nowLocal());

	function setStartNow() {
		startDate = nowLocal();
	}

	function setEndNow() {
		endDate = nowLocal();
	}

	function swapDates() {
		[startDate, endDate] = [endDate, startDate];
	}

	let result = $derived.by(() => {
		if (!startDate || !endDate) return null;
		try {
			return calculateDateDifference(startDate, endDate);
		} catch {
			return null;
		}
	});

	function copyValue(value: number) {
		copyText(value.toString());
	}
</script>

<div class="mx-auto mt-10 max-w-xl">
	<header class="mb-20">
		<h1 class="block text-center text-xl font-bold">Date & Time Calculator</h1>
		<p class="text-muted-foreground text-center">
			Calculate the difference between two dates in seconds, minutes, hours, and days.
		</p>
	</header>

	<div class="flex flex-col gap-6 rounded-lg border border-solid border-gray-300 p-8">
		<div class="border-ring/50 flex flex-col gap-4 rounded-lg border border-solid p-3">
			<div class="flex items-end gap-2">
				<div class="flex flex-1 flex-col gap-2">
					<div class="flex items-center justify-between">
						<Label.Root>Start</Label.Root>
						<Button variant="outline" size="sm" onclick={setStartNow}>Now</Button>
					</div>
					<InputGroup.Root>
						<InputGroup.Input type="datetime-local" bind:value={startDate} />
					</InputGroup.Root>
				</div>

				<Button variant="outline" size="icon" onclick={swapDates} title="Swap dates">
					<ArrowLeftRight class="size-4" />
				</Button>

				<div class="flex flex-1 flex-col gap-2">
					<div class="flex items-center justify-between">
						<Label.Root>End</Label.Root>
						<Button variant="outline" size="sm" onclick={setEndNow}>Now</Button>
					</div>
					<InputGroup.Root>
						<InputGroup.Input type="datetime-local" bind:value={endDate} />
					</InputGroup.Root>
				</div>
			</div>
		</div>

		{#if result}
			<div class="border-ring/50 flex flex-col gap-3 rounded-lg border border-solid p-3">
				<p class="text-sm font-medium">
					Difference {result.isNegative ? '(end is before start)' : ''}
				</p>
				<div class="grid grid-cols-2 gap-3">
					{#each [{ label: 'Days', value: result.totalDays }, { label: 'Hours', value: result.totalHours }, { label: 'Minutes', value: result.totalMinutes }, { label: 'Seconds', value: result.totalSeconds }] as row (row.label)}
						<div class="bg-muted flex items-center justify-between rounded p-2">
							<div>
								<p class="text-muted-foreground text-xs">{row.label}</p>
								<p class="text-lg font-semibold">{row.value.toLocaleString()}</p>
							</div>
							<ButtonGroup.Root>
								<Button variant="outline" size="icon" onclick={() => copyValue(row.value)}>
									<Clipboard />
								</Button>
							</ButtonGroup.Root>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<p class="text-muted-foreground text-center text-sm">Enter valid start and end dates.</p>
		{/if}
	</div>
</div>
