<script>
	import Download from '@lucide/svelte/icons/download';

	import ReferencesSheet from '$lib/components/custom/references/references-sheet.svelte';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { httpCodes } from '$lib/core/http-codes';

	import { columns } from './columns.js';
	import DataTable from './data-table.svelte';

	function downloadJson() {
		const dataStr = JSON.stringify(httpCodes, null, 2);
		const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

		const link = document.createElement('a');
		link.setAttribute('href', dataUri);
		link.setAttribute('download', 'httpCodes.json');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
</script>

<header class="mb-6 flex justify-between">
	<h1 class="block text-xl font-bold">Http Codes</h1>
	<div class="flex items-center gap-4">
		<ButtonGroup.Root>
			<Button variant="outline" onclick={downloadJson}><Download /> Download JSON</Button>

			<ReferencesSheet
				references={[
					{
						title: 'List of HTTP status codes',
						url: 'https://en.wikipedia.org/wiki/List_of_HTTP_status_codes'
					},
					{
						title: 'Hypertext Transfer Protocol (HTTP) Status Code Registry',
						url: 'https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml'
					}
				]}
			/>
		</ButtonGroup.Root>
	</div>
</header>

<DataTable data={httpCodes} {columns} />
