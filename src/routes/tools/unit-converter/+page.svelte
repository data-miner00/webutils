<script lang="ts">
	import { ArrowLeftRight, Copy, RotateCcw } from '@lucide/svelte';

	import ReferencesSheet from '$lib/components/custom/references/references-sheet.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Input from '$lib/components/ui/input/index.js';
	import * as Select from '$lib/components/ui/select';
	import { copyText } from '$lib/core/copy-to-clipboard';
	import { UNIT_CATEGORIES, type UnitCategory, convertUnit, formatNumber } from '$lib/core/units';

	let selectedCategory = $state<UnitCategory>('temperature');
	let fromUnit = $state('celsius');
	let toUnit = $state('fahrenheit');
	let inputValue = $state(25);
	let result = $state(0);

	// Update result when inputs change
	$effect(() => {
		result = convertUnit(inputValue, fromUnit, toUnit, selectedCategory);
	});

	// Update available units when category changes
	$effect(() => {
		const category = UNIT_CATEGORIES[selectedCategory];
		const unitKeys = Object.keys(category.units);
		fromUnit = unitKeys[0];
		toUnit = unitKeys[1] || unitKeys[0];
	});

	function swapUnits() {
		const temp = fromUnit;
		fromUnit = toUnit;
		toUnit = temp;
		const tempValue = inputValue;
		inputValue = result;
		result = tempValue;
	}

	function clearAll() {
		inputValue = 0;
	}

	function copyResult() {
		copyText(formatNumber(result));
	}

	const categoryOptions = Object.entries(UNIT_CATEGORIES).map(([key, value]) => ({
		value: key,
		label: value.name
	}));

	function getUnitOptions(category: UnitCategory) {
		return Object.entries(UNIT_CATEGORIES[category].units).map(([key, unit]) => ({
			value: key,
			label: `${unit.name} (${unit.symbol})`
		}));
	}
</script>

<div class="min-h-full px-4 py-6">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-xl font-bold">Unit Converter</h1>
		<ReferencesSheet
			references={[
				{
					title: 'Unit Converters',
					url: 'https://www.unitconverters.net/'
				}
			]}
		/>
	</div>

	<div class="mx-auto max-w-4xl space-y-6">
		<!-- Category Selection -->
		<div class="bg-card rounded-lg border p-6 shadow-sm">
			<label for="category-select" class="mb-2 block text-sm font-medium">
				Conversion Category
			</label>
			<Select.Root type="single" bind:value={selectedCategory}>
				<Select.Trigger class="w-full">
					{selectedCategory ? UNIT_CATEGORIES[selectedCategory].name : 'Select Category'}
				</Select.Trigger>
				<Select.Content>
					{#each categoryOptions as option}
						<Select.Item value={option.value}>
							{option.label}
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<!-- Conversion Interface -->
		<div class="bg-card rounded-lg border p-6 shadow-sm">
			<div class="grid gap-6 md:grid-cols-2">
				<!-- From Unit -->
				<div class="space-y-2">
					<label class="block text-sm font-medium">From</label>
					<div class="flex gap-2">
						<Select.Root type="single" bind:value={fromUnit}>
							<Select.Trigger>
								{fromUnit ? UNIT_CATEGORIES[selectedCategory].units[fromUnit].name : 'Select Unit'}
							</Select.Trigger>
							<Select.Content class="flex-1">
								{#each getUnitOptions(selectedCategory) as option}
									<Select.Item value={option.value}>
										{option.label}
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
						<Input.Root class="w-32">
							<Input.Input type="number" bind:value={inputValue} placeholder="0" step="any" />
						</Input.Root>
					</div>
				</div>

				<!-- To Unit -->
				<div class="space-y-2">
					<label class="block text-sm font-medium">To</label>
					<div class="flex gap-2">
						<Select.Root type="single" bind:value={toUnit}>
							<Select.Trigger>
								{toUnit ? UNIT_CATEGORIES[selectedCategory].units[toUnit].name : 'Select Unit'}
							</Select.Trigger>
							<Select.Content class="flex-1">
								{#each getUnitOptions(selectedCategory) as option}
									<Select.Item value={option.value}>
										{option.label}
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
						<div class="bg-muted flex w-32 items-center rounded-md border px-3 text-sm">
							{formatNumber(result)}
						</div>
					</div>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="mt-6 flex flex-wrap gap-2">
				<Button variant="outline" size="sm" onclick={swapUnits}>
					<ArrowLeftRight class="size-4" />
					Swap
				</Button>
				<Button variant="outline" size="sm" onclick={copyResult}>
					<Copy class="size-4" />
					Copy Result
				</Button>
				<Button variant="outline" size="sm" onclick={clearAll}>
					<RotateCcw class="size-4" />
					Clear
				</Button>
			</div>
		</div>

		<!-- Quick Conversions for Current Category -->
		{#if selectedCategory === 'temperature'}
			<div class="bg-card rounded-lg border p-6 shadow-sm">
				<h3 class="mb-4 text-lg font-semibold">Temperature Formulas</h3>
				<div class="grid gap-2 text-sm">
					<p><strong>°C to °F:</strong> celsius × (9/5) + 32</p>
					<p><strong>°C to K:</strong> celsius + 273.15</p>
					<p><strong>°F to °C:</strong> (fahrenheit - 32) × (5/9)</p>
					<p><strong>K to °C:</strong> kelvin - 273.15</p>
					<p class="text-muted-foreground">0K refers to absolute zero (-273.15°C)</p>
				</div>
			</div>
		{/if}

		<!-- Popular Conversions -->
		<div class="bg-card rounded-lg border p-6 shadow-sm">
			<h3 class="mb-4 text-lg font-semibold">Popular Conversions</h3>
			<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				<Button
					variant="ghost"
					class="h-auto justify-start p-3"
					onclick={() => {
						selectedCategory = 'length';
						fromUnit = 'meter';
						toUnit = 'foot';
						inputValue = 1;
					}}
				>
					<div class="text-left">
						<div class="font-medium">1 m → ft</div>
						<div class="text-muted-foreground text-sm">Length</div>
					</div>
				</Button>
				<Button
					variant="ghost"
					class="h-auto justify-start p-3"
					onclick={() => {
						selectedCategory = 'weight';
						fromUnit = 'kilogram';
						toUnit = 'pound';
						inputValue = 1;
					}}
				>
					<div class="text-left">
						<div class="font-medium">1 kg → lb</div>
						<div class="text-muted-foreground text-sm">Weight</div>
					</div>
				</Button>
				<Button
					variant="ghost"
					class="h-auto justify-start p-3"
					onclick={() => {
						selectedCategory = 'volume';
						fromUnit = 'liter';
						toUnit = 'gallon';
						inputValue = 1;
					}}
				>
					<div class="text-left">
						<div class="font-medium">1 L → gal</div>
						<div class="text-muted-foreground text-sm">Volume</div>
					</div>
				</Button>
				<Button
					variant="ghost"
					class="h-auto justify-start p-3"
					onclick={() => {
						selectedCategory = 'digital';
						fromUnit = 'megabyte';
						toUnit = 'gigabyte';
						inputValue = 1000;
					}}
				>
					<div class="text-left">
						<div class="font-medium">1000 MB → GB</div>
						<div class="text-muted-foreground text-sm">Digital</div>
					</div>
				</Button>
				<Button
					variant="ghost"
					class="h-auto justify-start p-3"
					onclick={() => {
						selectedCategory = 'speed';
						fromUnit = 'kilometer_per_hour';
						toUnit = 'mile_per_hour';
						inputValue = 100;
					}}
				>
					<div class="text-left">
						<div class="font-medium">100 km/h → mph</div>
						<div class="text-muted-foreground text-sm">Speed</div>
					</div>
				</Button>
				<Button
					variant="ghost"
					class="h-auto justify-start p-3"
					onclick={() => {
						selectedCategory = 'area';
						fromUnit = 'square_meter';
						toUnit = 'square_foot';
						inputValue = 1;
					}}
				>
					<div class="text-left">
						<div class="font-medium">1 m² → ft²</div>
						<div class="text-muted-foreground text-sm">Area</div>
					</div>
				</Button>
			</div>
		</div>
	</div>
</div>
