import { renderComponent } from '$lib/components/ui/data-table';
import type { Country } from '$lib/core/country';
import type { ColumnDef } from '@tanstack/table-core';
import DataTableActions from './data-table-actions.svelte';
import DataTableNameButton from './data-table-name-button.svelte';

export const columns: ColumnDef<Country>[] = [
	{
		accessorKey: 'emoji',
		header: 'Emoji'
	},
	{
		accessorKey: 'name',
		header: ({ column }) =>
			renderComponent(DataTableNameButton, {
				onclick: column.getToggleSortingHandler()
			})
	},
	{
		accessorKey: 'iso2',
		header: 'ISO2'
	},
	{
		accessorKey: 'iso3',
		header: 'ISO3'
	},
	{
		accessorKey: 'countryCode',
		header: 'Country Code'
	},
	{
		accessorKey: 'population',
		header: 'Population'
	},
	{
		accessorKey: 'areaKm2',
		header: 'Area (km²)'
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			// You can pass whatever you need from `row.original` to the component
			return renderComponent(DataTableActions, {
				id: row.original.iso2,
				link: row.original.href,
				emoji: row.original.emoji,
				name: row.original.name
			});
		}
	}
];
