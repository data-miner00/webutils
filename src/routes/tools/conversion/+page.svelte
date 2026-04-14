<script lang="ts">
	import ReferencesSheet from '$lib/components/custom/references/references-sheet.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import * as weather from '$lib/core/weather';

	const ROOM_TEMP = 25;
	let celciusInput = $state(ROOM_TEMP);
	let farenheitInput = $state(weather.convertCelciusToFarenheit(ROOM_TEMP));
	let kelvinInput = $state(weather.convertCelciusToKelvin(ROOM_TEMP));
</script>

<div class="h-full px-4 py-6">
	<div class="mb-4 flex items-center justify-between">
		<h1 class="block text-2xl font-bold">Unit Conversion</h1>

		<ReferencesSheet
			references={[
				{
					title: 'Unit Conversion',
					url: 'https://www.unitconverters.net/'
				}
			]}
		/>
	</div>

	<div>
		<h2>Formula</h2>

		<p>1°C to °F = celcius * (9 / 5) + 32</p>
		<p>1°C to K = celcius + 273</p>
		<p>0K refers to the absolute zero.</p>

		<Button>Example</Button>
		<Button>Clear</Button>
	</div>

	<div class="my-5 flex items-center">
		<InputGroup.Root class="max-w-30">
			<InputGroup.Input placeholder="0" bind:value={celciusInput} type="number" />
			<InputGroup.Addon align="inline-end">°C</InputGroup.Addon>
		</InputGroup.Root>

		<div>
			is equivalent to <span class="font-bold"
				>{weather.convertCelciusToFarenheit(celciusInput)}°F</span
			>
			and <span class="font-bold">{weather.convertCelciusToKelvin(celciusInput)}K</span>
		</div>
	</div>

	<div class="my-5 flex items-center">
		<InputGroup.Root class="max-w-30">
			<InputGroup.Input placeholder="0" bind:value={farenheitInput} type="number" />
			<InputGroup.Addon align="inline-end">°F</InputGroup.Addon>
		</InputGroup.Root>

		<div>
			is equivalent to <span class="font-bold"
				>{weather.convertFarenheitToCelcius(farenheitInput)}°C</span
			>
			and <span class="font-bold">{weather.convertFarenheitToKelvin(farenheitInput)}K</span>
		</div>
	</div>

	<div class="my-5 flex items-center">
		<InputGroup.Root class="max-w-30">
			<InputGroup.Input placeholder="0" bind:value={kelvinInput} type="number" />
			<InputGroup.Addon align="inline-end">K</InputGroup.Addon>
		</InputGroup.Root>

		<div>
			is equivalent to <span class="font-bold">{weather.convertKelvinToCelcius(kelvinInput)}°C</span
			>
			and <span class="font-bold">{weather.convertKelvinToFarenheit(kelvinInput)}°F</span>
		</div>
	</div>
</div>
