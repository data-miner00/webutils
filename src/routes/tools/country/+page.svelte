<script lang="ts">
	import Download from '@lucide/svelte/icons/download';

	import ReferencesSheet from '$lib/components/custom/references/references-sheet.svelte';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { countries } from '$lib/core/country';

	import { columns } from './columns.js';
	import DataTable from './data-table.svelte';

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

<header class="mb-6 flex justify-between">
	<h1 class="block text-xl font-bold">Countries</h1>
	<div class="flex items-center gap-4">
		<ButtonGroup.Root>
			<Button variant="outline" onclick={downloadCountriesJson}><Download /> Download JSON</Button>
			<ReferencesSheet
				references={[
					{
						title: 'CountryCode.org',
						url: 'https://countrycode.org/'
					},
					{
						title: 'ISO 3166 Country Codes - ISO.org',
						url: 'https://www.iso.org/iso-3166-country-codes.html'
					},
					{
						title: 'Flag Match',
						url: 'https://flagmatch.com/'
					}
				]}
			/>
		</ButtonGroup.Root>
	</div>
</header>

<DataTable data={countries} {columns} />
