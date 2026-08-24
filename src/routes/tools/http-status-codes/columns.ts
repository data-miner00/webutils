import type { ColumnDef } from '@tanstack/table-core';

import type { HttpCode } from '$lib/core/http-codes';

export const columns: ColumnDef<HttpCode>[] = [
	{
		accessorKey: 'value',
		header: 'Value'
	},
	{
		accessorKey: 'description',
		header: 'Description'
	},
	{
		accessorKey: 'meaning',
		header: 'Meaning'
	},
	{
		accessorKey: 'deprecated',
		header: 'Deprecated'
	},
	{
		accessorKey: 'rfc',
		header: 'RFC'
	}
];
