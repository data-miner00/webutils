import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';

import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';
import type { Secret } from '$lib/core/secrets';

import DataTableActions from './data-table-actions.svelte';
import DataTableCheckbox from './data-table-checkbox.svelte';
import DataTableNameButton from './data-table-name-button.svelte';

export const columns: ColumnDef<Secret>[] = [
	{
		id: 'select',
		header: ({ table }) =>
			renderComponent(DataTableCheckbox, {
				checked: table.getIsAllPageRowsSelected(),
				indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
				onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
				'aria-label': 'Select all'
			}),
		cell: ({ row }) =>
			renderComponent(DataTableCheckbox, {
				checked: row.getIsSelected(),
				onCheckedChange: (value) => row.toggleSelected(!!value),
				'aria-label': 'Select row'
			}),
		enableSorting: false,
		enableHiding: false
	},
	{
		accessorKey: 'name',
		header: ({ column }) =>
			renderComponent(DataTableNameButton, {
				onclick: column.getToggleSortingHandler()
			}),
		cell: ({ row }) => {
			const nameSnippet = createRawSnippet<[{ name: string }]>((getName) => {
				const { name } = getName();
				return {
					render: () => `<div class="capitalize">${name}</div>`
				};
			});
			return renderSnippet(nameSnippet, {
				name: row.original.name
			});
		}
	},
	{
		accessorKey: 'encryptedSecret',
		header: 'Secret',
		cell: ({ row }) => {
			const encryptedSecretSnippet = createRawSnippet<[{ encryptedSecret: string }]>(
				(getencryptedSecret) => {
					const { encryptedSecret } = getencryptedSecret();
					return {
						render: () => `<div class="lowercase">${encryptedSecret}</div>`
					};
				}
			);

			return renderSnippet(encryptedSecretSnippet, {
				encryptedSecret: row.original.encryptedSecret
			});
		}
	},
	{
		accessorKey: 'version',
		header: () => {
			const versionHeaderSnippet = createRawSnippet(() => {
				return {
					render: () => `<div class="text-end">Version</div>`
				};
			});
			return renderSnippet(versionHeaderSnippet);
		},
		cell: ({ row }) => {
			const versionCellSnippet = createRawSnippet<[{ version: number }]>((getVersion) => {
				const { version } = getVersion();
				return {
					render: () => `<div class="text-end font-medium">${version}</div>`
				};
			});
			return renderSnippet(versionCellSnippet, {
				version: row.original.version
			});
		}
	},
	{
		accessorKey: 'createdAt',
		header: () => {
			const headerSnippet = createRawSnippet(() => {
				return {
					render: () => `<div class="text-end">Created At</div>`
				};
			});
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			const cellSnippet = createRawSnippet<[{ createdAt: string }]>((getcreatedAt) => {
				const { createdAt } = getcreatedAt();
				return {
					render: () => `<div class="text-end font-medium">${createdAt}</div>`
				};
			});
			return renderSnippet(cellSnippet, {
				createdAt: row.original.createdAt
			});
		}
	},
	{
		accessorKey: 'updatedAt',
		header: () => {
			const headerSnippet = createRawSnippet(() => {
				return {
					render: () => `<div class="text-end">Updated At</div>`
				};
			});
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			const cellSnippet = createRawSnippet<[{ updatedAt: string }]>((getUpdatedAt) => {
				const { updatedAt } = getUpdatedAt();
				return {
					render: () => `<div class="text-end font-medium">${updatedAt}</div>`
				};
			});
			return renderSnippet(cellSnippet, {
				updatedAt: row.original.updatedAt
			});
		}
	},
	{
		id: 'actions',
		enableHiding: false,
		cell: ({ row }) => renderComponent(DataTableActions)
	}
];
