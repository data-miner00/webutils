<script lang="ts">
	import { countries, type Country } from '$lib/core/country';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Download from '@lucide/svelte/icons/download';
	import References from '$lib/components/custom/references/references.svelte';

	function downloadCountriesJson() {
		const dataStr = JSON.stringify(countries, null, 2);
		const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

		const link = document.createElement('a');
		link.setAttribute('href', dataUri);
		link.setAttribute('download', 'countries.json');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
</script>

<header class="flex justify-between mb-6">
	<h1 class="text-xl font-bold block">Countries</h1>
	<div class="flex items-center gap-4">
		<ButtonGroup.Root>
			<Button variant="outline" onclick={downloadCountriesJson}><Download /> Download JSON</Button>
		</ButtonGroup.Root>
	</div>
</header>

<!-- TODO: Make this into data table -->

<Table.Root>
	<Table.Caption>A list of countries.</Table.Caption>
	<Table.Header>
		<Table.Row class="bg-gray-50">
			<Table.Head class="w-[100px]">Name</Table.Head>
			<Table.Head>ISO2</Table.Head>
			<Table.Head>ISO3</Table.Head>
			<Table.Head>Country Code</Table.Head>
			<Table.Head>Area (km²)</Table.Head>
			<Table.Head class="text-end">Population</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each countries as country (country.iso2)}
			<Table.Row>
				<Table.Cell class="font-medium">
					<a href={country.href} target="_blank">{country.name}</a>
				</Table.Cell>
				<Table.Cell>{country.iso2}</Table.Cell>
				<Table.Cell>{country.iso3}</Table.Cell>
				<Table.Cell>{country.countryCode}</Table.Cell>
				<Table.Cell>{country.areaKm2}</Table.Cell>
				<Table.Cell class="text-end">{country.population}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>

<References
	references={[
		{
			title: 'CountryCode.org',
			url: 'https://countrycode.org/'
		}
	]}
/>
