<script lang="ts">
	import { ArrowUpRightIcon, Lock, Plus } from '@lucide/svelte';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import {
		type ColumnDef,
		type ColumnFiltersState,
		type PaginationState,
		type RowSelectionState,
		type SortingState,
		type VisibilityState,
		getCoreRowModel,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel
	} from '@tanstack/table-core';
	import { createRawSnippet, onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import {
		FlexRender,
		createSvelteTable,
		renderComponent,
		renderSnippet
	} from '$lib/components/ui/data-table/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Empty from '$lib/components/ui/empty/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { db, initializeDatabase } from '$lib/core/Database';
	import { IndexedDBRepository } from '$lib/core/IndexedDbRepository';
	import { SECRET_STORE_NAME, type Secret } from '$lib/core/secrets';

	import { columns } from './columns';

	const repository = new IndexedDBRepository<Secret>(db, SECRET_STORE_NAME);

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let rowSelection = $state<RowSelectionState>({});
	let columnVisibility = $state<VisibilityState>({});

	let isDialogOpen = $state(false);
	let secrets = $state<Secret[]>([]);
	let searchQuery = $state('');
	let isEditMode = $state(false);

	let inputSecret = $state<Secret>({
		id: crypto.randomUUID(),
		snippet: '',
		name: '',
		type: '',
		encryptedSecret: '',
		version: 1,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	});

	onMount(async () => {
		if (!db.isDbInitialized) {
			await initializeDatabase();
		}

		secrets = await repository.getAll();
	});

	async function addToDb() {
		const now = new Date().toISOString();
		const input = $state.snapshot(inputSecret);
		input.id = crypto.randomUUID();
		input.createdAt = now;
		input.updatedAt = now;
		input.snippet = input.encryptedSecret.slice(0, 3) + '*******';
		await repository.create(input);

		secrets.push(input);
		secrets = secrets;
		isDialogOpen = false;

		toast.success('Secret added succesfully.');
	}

	async function update() {
		const input = $state.snapshot(inputSecret);

		input.updatedAt = new Date().toISOString();
		input.version++;
		input.snippet = input.encryptedSecret.slice(0, 3) + '*******';
		await repository.update(input.id, input);

		const index = secrets.findIndex((secret) => secret.id === input.id);
		secrets.splice(index, 1, input);
		secrets = secrets;

		isDialogOpen = false;

		toast.success('Secret updated successfully.');
	}

	async function remove(id: string) {
		if (confirm('Are you sure you want to delete this secret?')) {
			await repository.delete(id);

			secrets = secrets.filter((secret) => secret.id != id);

			toast.success('Secret deleted successfully.');
		}
	}

	const table = createSvelteTable({
		get data() {
			return secrets;
		},
		columns,
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get columnVisibility() {
				return columnVisibility;
			},
			get rowSelection() {
				return rowSelection;
			},
			get columnFilters() {
				return columnFilters;
			}
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		onColumnVisibilityChange: (updater) => {
			if (typeof updater === 'function') {
				columnVisibility = updater(columnVisibility);
			} else {
				columnVisibility = updater;
			}
		},
		onRowSelectionChange: (updater) => {
			if (typeof updater === 'function') {
				rowSelection = updater(rowSelection);
			} else {
				rowSelection = updater;
			}
		}
	});
</script>

<div class="-mb-8 w-full">
	<div class="flex items-center justify-between py-4">
		<Input
			placeholder="Filter names..."
			value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
			oninput={(e) => table.getColumn('name')?.setFilterValue(e.currentTarget.value)}
			onchange={(e) => {
				table.getColumn('name')?.setFilterValue(e.currentTarget.value);
			}}
			class="max-w-sm"
		/>

		<div class="flex items-center gap-2">
			<Dialog.Root bind:open={isDialogOpen}>
				<form>
					<Dialog.Trigger
						class={buttonVariants({ variant: 'default' })}
						onclick={() => (isEditMode = false)}
					>
						<Plus />
						Add Secret
					</Dialog.Trigger>
					<Dialog.Content class="sm:max-w-[425px]">
						<Dialog.Header>
							<Dialog.Title>{isEditMode ? 'Edit Secret' : 'Add New Secret'}</Dialog.Title>
							<Dialog.Description>
								{isEditMode
									? "Edit the details for the link. Click save when you're done."
									: "Fill in the details for the new link. Click save when you're done."}
							</Dialog.Description>
						</Dialog.Header>
						<div class="grid gap-4">
							<div class="grid gap-3">
								<Label for="name">Name</Label>
								<Input
									id="name"
									name="name"
									placeholder="e.g. Surfshark Password"
									bind:value={inputSecret.name}
								/>
							</div>
							<div class="grid gap-3">
								<Label for="type">Type</Label>
								<Input
									id="type"
									name="type"
									placeholder="e.g. password"
									bind:value={inputSecret.type}
								/>
							</div>
							<div class="grid gap-3">
								<Label for="secret">Secret</Label>
								<Input
									id="secret"
									name="secret"
									placeholder="e.g. dfs^hd$uf@298sfam"
									bind:value={inputSecret.encryptedSecret}
								/>
							</div>
						</div>
						<Dialog.Footer>
							<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
							<Button type="submit" onclick={() => (isEditMode ? update() : addToDb())}>Save</Button
							>
						</Dialog.Footer>
					</Dialog.Content>
				</form>
			</Dialog.Root>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="outline" class="ms-auto">
							Columns <ChevronDownIcon class="ms-2 size-4" />
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					{#each table.getAllColumns().filter((col) => col.getCanHide()) as column (column)}
						<DropdownMenu.CheckboxItem
							class="capitalize"
							bind:checked={() => column.getIsVisible(), (v) => column.toggleVisibility(!!v)}
						>
							{column.id}
						</DropdownMenu.CheckboxItem>
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>

	{#if secrets.length > 0}
		<div class="rounded-md border">
			<Table.Root>
				<Table.Header>
					{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
						<Table.Row>
							{#each headerGroup.headers as header (header.id)}
								<Table.Head class="[&:has([role=checkbox])]:ps-3">
									{#if !header.isPlaceholder}
										<FlexRender
											content={header.column.columnDef.header}
											context={header.getContext()}
										/>
									{/if}
								</Table.Head>
							{/each}
						</Table.Row>
					{/each}
				</Table.Header>
				<Table.Body>
					{#each table.getRowModel().rows as row (row.id)}
						<Table.Row data-state={row.getIsSelected() && 'selected'}>
							{#each row.getVisibleCells() as cell (cell.id)}
								<Table.Cell class="[&:has([role=checkbox])]:ps-3">
									<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
								</Table.Cell>
							{/each}
						</Table.Row>
					{:else}
						<Table.Row>
							<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
		<div class="flex items-center justify-end space-x-2 pt-4">
			<div class="text-muted-foreground flex-1 text-sm">
				{table.getFilteredSelectedRowModel().rows.length} of
				{table.getFilteredRowModel().rows.length} row(s) selected.
			</div>
			<div class="space-x-2">
				<Button
					variant="outline"
					size="sm"
					onclick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onclick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Next
				</Button>
			</div>
		</div>
	{:else}
		<Empty.Root class="border border-solid border-gray-300">
			<Empty.Header>
				<Empty.Media variant="icon">
					<Lock />
				</Empty.Media>
				<Empty.Title>No Secrets Yet</Empty.Title>
				<Empty.Description>
					You haven't entered created any secrets yet. Get started by creating one.
				</Empty.Description>
			</Empty.Header>
			<Empty.Content>
				<div class="flex gap-2">
					<Button onclick={() => (isDialogOpen = true)}>Create Secret</Button>
					<Button variant="outline" onclick={() => {}}>Load Example 2</Button>
				</div>
			</Empty.Content>
			<Button variant="link" class="text-muted-foreground" size="sm">
				<a href="#/">
					Learn More <ArrowUpRightIcon class="inline" />
				</a>
			</Button>
		</Empty.Root>
	{/if}
</div>
