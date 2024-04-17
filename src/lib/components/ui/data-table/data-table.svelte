<script lang="ts">
	import { createTable, Render, Subscribe, createRender } from 'svelte-headless-table';
	import {
		addPagination,
		addSortBy,
		addTableFilter,
		addHiddenColumns,
		addSelectedRows
	} from 'svelte-headless-table/plugins';
	import { readable } from 'svelte/store';
	import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import * as Table from '$lib/components/ui/table';
	import DataTableActions from './data-table-actions.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import DataTableCheckbox from './data-table-checkbox.svelte';

	type Payment = {
		id: string;
		amount: number;
		status: 'pending' | 'processing' | 'success' | 'failed';
		email: string;
	};

	const data: Payment[] = [
		{ id: 'm5gr84i9', amount: 316, status: 'success', email: 'ken99@yahoo.com' },
		{ id: 'j7dh93f2', amount: 245, status: 'pending', email: 'alice22@gmail.com' },
		{ id: 'g3re62k8', amount: 532, status: 'success', email: 'bob33@hotmail.com' },
		{ id: 'h8yu74t1', amount: 178, status: 'failed', email: 'eve44@gmail.com' },
		{ id: 'b6rt35p7', amount: 420, status: 'success', email: 'charlie55@yahoo.com' },
		{ id: 'f9dn48m2', amount: 633, status: 'pending', email: 'david66@hotmail.com' },
		{ id: 't3hf69z5', amount: 198, status: 'success', email: 'frank77@gmail.com' },
		{ id: 'p5rg84i3', amount: 312, status: 'failed', email: 'george88@yahoo.com' },
		{ id: 'r2ud95g7', amount: 578, status: 'success', email: 'hannah99@hotmail.com' },
		{ id: 'l7db63j4', amount: 214, status: 'pending', email: 'irene11@gmail.com' },
		{ id: 'e2fn48p9', amount: 721, status: 'success', email: 'joe22@yahoo.com' },
		{ id: 'k3re87j2', amount: 159, status: 'failed', email: 'kate33@hotmail.com' },
		{ id: 'a5ty84n6', amount: 487, status: 'success', email: 'laura44@gmail.com' },
		{ id: 'm9gf28t3', amount: 273, status: 'pending', email: 'mike55@yahoo.com' },
		{ id: 'n3hu74b5', amount: 369, status: 'success', email: 'natalie66@hotmail.com' },
		{ id: 'w6yt35k1', amount: 144, status: 'failed', email: 'oliver77@gmail.com' },
		{ id: 'z8er48l7', amount: 598, status: 'success', email: 'peter88@yahoo.com' },
		{ id: 'q7pw92h4', amount: 231, status: 'pending', email: 'quinn99@hotmail.com' },
		{ id: 's4nt85r9', amount: 659, status: 'success', email: 'rachel11@gmail.com' },
		{ id: 'u9fv37c2', amount: 187, status: 'failed', email: 'steve22@yahoo.com' }
	];
	const table = createTable(readable(data), {
		page: addPagination(),
		sort: addSortBy({ disableMultiSort: true }),
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.includes(filterValue)
		}),
		hide: addHiddenColumns(),
		select: addSelectedRows()
	});

	const columns = table.createColumns([
		table.column({
			accessor: 'id',
			header: (_, { pluginStates }) => {
				const { allPageRowsSelected } = pluginStates.select;
				return createRender(DataTableCheckbox, {
					checked: allPageRowsSelected
				});
			},
			cell: ({ row }, { pluginStates }) => {
				const { getRowState } = pluginStates.select;
				const { isSelected } = getRowState(row);

				return createRender(DataTableCheckbox, {
					checked: isSelected
				});
			},
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: 'status',
			header: 'Status',
			plugins: {
				sort: {
					disable: true
				},
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: 'email',
			header: 'Email'
		}),
		table.column({
			accessor: 'amount',
			header: 'Amount',
			cell: ({ value }) => {
				const formatted = new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD'
				}).format(value);
				return formatted;
			},
			plugins: {
				sort: {
					disable: true
				},
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: ({ id }) => id,
			header: '',
			cell: ({ value }) => {
				return createRender(DataTableActions, { id: value });
			},
			plugins: {
				sort: {
					disable: true
				}
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, flatColumns, rows } =
		table.createViewModel(columns);

	const { pageIndex, hasNextPage, hasPreviousPage } = pluginStates.page;
	const { filterValue } = pluginStates.filter;
	const { hiddenColumnIds } = pluginStates.hide;
	const { selectedDataIds } = pluginStates.select;

	const ids = flatColumns.map((col) => col.id);
	let hideForId = Object.fromEntries(ids.map((id) => [id, true]));

	$: $hiddenColumnIds = Object.entries(hideForId)
		.filter(([, hide]) => !hide)
		.map(([id]) => id);

	const hidableCols = ['status', 'email', 'amount'];
</script>

<div>
	<div class="flex items-center">
		<Input class="max-w-sm" placeholder="Filter emails..." type="text" bind:value={$filterValue} />
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button variant="outline" class="ml-auto" builders={[builder]}>
					Colunas <ChevronDown class="ml-2 h-4 w-4" />
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				{#each flatColumns as col}
					{#if hidableCols.includes(col.id)}
						<DropdownMenu.CheckboxItem bind:checked={hideForId[col.id]}>
							{col.header}
						</DropdownMenu.CheckboxItem>
					{/if}
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>

	<div class="rounded-md border">
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
									<Table.Head {...attrs} class="[&:has([role=checkbox])]:pl-3">
										{#if cell.id === 'amount'}
											<div class="text-right">
												<Render of={cell.render()} />
											</div>
										{:else if cell.id === 'email'}
											<Button variant="ghost" on:click={props.sort.toggle}>
												<Render of={cell.render()} />
												<ArrowUpDown class={'ml-2 h-4 w-4'} />
											</Button>
										{:else}
											<Render of={cell.render()} />
										{/if}
									</Table.Head>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Header>
			<Table.Body {...$tableBodyAttrs}>
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Table.Row {...rowAttrs} data-state={$selectedDataIds[row.id] && 'selected'}>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell {...attrs}>
										{#if cell.id === 'amount'}
											<div class="text-right font-medium">
												<Render of={cell.render()} />
											</div>
										{:else if cell.id === 'status'}
											<div class="capitalize">
												<Render of={cell.render()} />
											</div>
										{:else}
											<Render of={cell.render()} />
										{/if}
									</Table.Cell>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<div class="flex items-center justify-end space-x-4 py-4">
		<div class="flex-1 text-sm text-muted-foreground">
			{Object.keys($selectedDataIds).length} of{' '}
			{$rows.length} row(s) selected.
		</div>
		<Button
			variant="outline"
			size="sm"
			on:click={() => ($pageIndex = $pageIndex - 1)}
			disabled={!$hasPreviousPage}>Previous</Button
		>
		<Button
			variant="outline"
			size="sm"
			disabled={!$hasNextPage}
			on:click={() => ($pageIndex = $pageIndex + 1)}>Next</Button
		>
	</div>
</div>
