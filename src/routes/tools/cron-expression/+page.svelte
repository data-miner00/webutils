<script lang="ts">
	import { Album, Copy, EllipsisVertical, Trash2 } from '@lucide/svelte';

	import ReferencesSheet from '$lib/components/custom/references/references-sheet.svelte';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as InputGroup from '$lib/components/ui/input-group';
	import * as Label from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import {
		type CronTimezone,
		cronExamples,
		cronFields,
		describeCron,
		getNextRuns,
		parseCron
	} from '$lib/core/cron';

	const runCount = 10;
	const timezoneLabels: Record<CronTimezone, string> = {
		local: 'Local time',
		utc: 'UTC'
	};

	let expression = $state('');
	let timezone = $state<CronTimezone>('local');

	let parsed = $derived.by(() => {
		if (!expression.trim()) return null;
		try {
			return { schedule: parseCron(expression) };
		} catch (error) {
			return { error: error instanceof Error ? error.message : String(error) };
		}
	});
	let description = $derived(parsed?.schedule ? describeCron(parsed.schedule) : '');
	let nextRuns = $derived(
		parsed?.schedule ? getNextRuns(parsed.schedule, new Date(), runCount, timezone) : []
	);
	let dateFormatter = $derived(
		new Intl.DateTimeFormat(undefined, {
			weekday: 'short',
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			timeZone: timezone === 'utc' ? 'UTC' : undefined
		})
	);
</script>

<div class="mx-auto my-10 max-w-xl">
	<header class="mb-20">
		<h1 class="block text-center text-xl font-bold">Cron Expression Parser</h1>
		<p class="text-muted-foreground text-center">
			Enter a cron expression to see what it means and when it runs next.
		</p>
	</header>

	<div class="flex flex-col gap-4">
		<div class="flex justify-end">
			<div class="flex items-center gap-2">
				<Select.Root type="single" name="timezone" bind:value={timezone}>
					<Select.Trigger>
						{timezoneLabels[timezone]}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Timezone</Select.Label>
							<Select.Item value="local" label="Local time">Local time</Select.Item>
							<Select.Item value="utc" label="UTC">UTC</Select.Item>
						</Select.Group>
					</Select.Content>
				</Select.Root>
				<ButtonGroup.Root>
					<ButtonGroup.Root>
						<Button variant="outline" onclick={() => (expression = cronExamples[1].expression)}>
							Example
						</Button>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								{#snippet child({ props })}
									<Button {...props} variant="outline" aria-label="More examples">
										<EllipsisVertical />
									</Button>
								{/snippet}
							</DropdownMenu.Trigger>
							<DropdownMenu.Content align="end" class="w-60">
								<DropdownMenu.Group>
									{#each cronExamples as example (example.expression)}
										<DropdownMenu.Item onclick={() => (expression = example.expression)}>
											<Album />
											{example.title}
										</DropdownMenu.Item>
									{/each}
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
						<ReferencesSheet
							references={[
								{
									title: 'crontab(5) Linux manual page',
									url: 'https://man7.org/linux/man-pages/man5/crontab.5.html'
								},
								{
									title: 'Crontab Guru',
									url: 'https://crontab.guru'
								},
								{
									title: 'Cron - Wikipedia',
									url: 'https://en.wikipedia.org/wiki/Cron'
								}
							]}
						/>
					</ButtonGroup.Root>
					<ButtonGroup.Root>
						<Button size="icon" variant="destructive" onclick={() => (expression = '')}>
							<Trash2 />
						</Button>
					</ButtonGroup.Root>
				</ButtonGroup.Root>
			</div>
		</div>

		<InputGroup.Root>
			<InputGroup.Input
				id="cron-expression"
				class="font-mono"
				placeholder="e.g. */5 * * * *"
				autocomplete="off"
				spellcheck="false"
				bind:value={expression}
			/>
			<InputGroup.Addon align="block-start">
				<Label.Root for="cron-expression" class="text-foreground">Expression</Label.Root>
				<InputGroup.Button
					class="ml-auto"
					size="icon-xs"
					aria-label="Copy expression"
					title="Copy expression"
					disabled={!expression.trim()}
					onclick={() => copyText(expression.trim())}
				>
					<Copy />
				</InputGroup.Button>
			</InputGroup.Addon>
		</InputGroup.Root>

		<div class="border-ring/50 flex flex-col gap-4 rounded-lg border border-solid p-3">
			<p class="text-sm">Output</p>

			{#if parsed?.schedule}
				<p class="text-lg font-semibold">{description}</p>

				<div class="grid grid-cols-5 gap-2">
					{#each cronFields as field (field.name)}
						<div class="bg-muted flex flex-col items-center gap-1 rounded p-2 text-center">
							<p class="font-mono font-semibold break-all">{parsed.schedule[field.name].raw}</p>
							<p class="text-muted-foreground text-xs">{field.label}</p>
							<p class="text-muted-foreground text-xs">{field.allowed}</p>
						</div>
					{/each}
				</div>

				<div class="flex flex-col gap-2">
					<p class="text-sm font-medium">Next {runCount} runs ({timezoneLabels[timezone]})</p>
					{#if nextRuns.length}
						<ol class="flex flex-col gap-1">
							{#each nextRuns as run (run.getTime())}
								<li class="bg-muted rounded px-3 py-2 font-mono text-sm">
									{dateFormatter.format(run)}
								</li>
							{/each}
						</ol>
					{:else}
						<p class="text-muted-foreground text-sm">No runs found in the next 10 years.</p>
					{/if}
				</div>
			{:else if parsed?.error}
				<p class="text-destructive text-sm">{parsed.error}</p>
			{:else}
				<p class="text-muted-foreground text-sm">
					Enter an expression with 5 fields: minute, hour, day-of-month, month and day-of-week.
				</p>
			{/if}
		</div>
	</div>
</div>
