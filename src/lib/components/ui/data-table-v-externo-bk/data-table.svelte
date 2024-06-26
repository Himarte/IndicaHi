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
	import type { LeadsSchema } from '$lib/server/database/schema';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	import { Label } from '$lib/components/ui/label/index.js';
	//  export let leads e uma promessa que vai ser resolvida typa do jeito certo e nao da erro
	export let leads: LeadsSchema[];

	// O createTable é uma função que cria a table e coloca funcionalidades e interaçoes
	const table = createTable(readable(leads), {
		page: addPagination({ initialPageIndex: 0, initialPageSize: 5 }),
		sort: addSortBy({ initialSortKeys: [{ id: 'status', order: 'desc' }] }),
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		}),
		hide: addHiddenColumns(),
		select: addSelectedRows()
	});

	// Colunas da tabela, aqui voce pode add mais colunas ou remover
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
			accessor: 'fullName',
			header: 'Nome Completo',
			plugins: {
				sort: {
					disable: true
				}
			}
		}),

		table.column({
			accessor: 'promoCode',
			header: 'Promo Code',

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
			accessor: 'status',
			header: 'Status',

			plugins: {
				sort: {
					disable: false
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

	const hidableCols = ['fullName', 'promoCode', 'status'];
</script>

<Tabs.Root value="pendentes" class="h-full w-full">
	<div class="flex flex-col gap-5">
		<div class="flex items-center justify-end gap-5">
			<Tabs.List class="flex gap-1">
				<Tabs.Trigger value="pendentes">Pendentes</Tabs.Trigger>
				<Tabs.Trigger value="sendo Atendido">Sendo Atendido</Tabs.Trigger>
				<Tabs.Trigger value="finalizados">Finalizados</Tabs.Trigger>
				<Tabs.Trigger value="sem sucesso">Cancelados</Tabs.Trigger>
			</Tabs.List>
			<Input
				class="ml-auto max-w-sm"
				placeholder="Pesquisar..."
				type="text"
				bind:value={$filterValue}
			/>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button variant="outline" builders={[builder]}>
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
		<Tabs.Content value="pendentes">
			<div class="rounded-md border border-secondary">
				<Table.Root {...$tableAttrs}>
					<Table.Header>
						{#each $headerRows as headerRow}
							<Subscribe rowAttrs={headerRow.attrs()}>
								<Table.Row>
									{#each headerRow.cells as cell (cell.id)}
										<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
											<Table.Head {...attrs} class="[&:has([role=checkbox])]:pl-3">
												{#if cell.id === 'status'}
													<Button variant="ghost" on:click={props.sort.toggle}>
														<Render of={cell.render()} />
														<ArrowUpDown class={'ml-2  h-4 w-4 '} />
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
												<!-- Para estilizar linhas especificas voce vincula ao nome da dado do Database -->
												{#if cell.id === 'status'}
													<!-- Esse erro tem a ver com a tipagem do cell.value nao mexer -->
													{#if cell.value === 'Sendo Atendido'}
														<div class="text-yellow-600">
															<Render of={cell.render()} />
														</div>
													{:else}
														<Render of={cell.render()} />
													{/if}
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
			<div class="flex items-center justify-end space-x-4">
				<div class="flex-1 text-sm text-muted-foreground">
					{Object.keys($selectedDataIds).length} de{' '}
					{$rows.length} Colunas selecionadas.
				</div>
				<Button
					variant="outline"
					size="sm"
					on:click={() => ($pageIndex = $pageIndex - 1)}
					disabled={!$hasPreviousPage}>Anterior</Button
				>
				<Button
					variant="outline"
					size="sm"
					disabled={!$hasNextPage}
					on:click={() => ($pageIndex = $pageIndex + 1)}>Proximo</Button
				>
			</div>
		</Tabs.Content>
		<Tabs.Content value="sendo Atendido">
			<div class="rounded-md border border-secondary">
				<Table.Root {...$tableAttrs}>
					<Table.Header>
						{#each $headerRows as headerRow}
							<Subscribe rowAttrs={headerRow.attrs()}>
								<Table.Row>
									{#each headerRow.cells as cell (cell.id)}
										<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
											<Table.Head {...attrs} class="[&:has([role=checkbox])]:pl-3">
												{#if cell.id === 'status'}
													<Button variant="ghost" on:click={props.sort.toggle}>
														<Render of={cell.render()} />
														<ArrowUpDown class={'ml-2  h-4 w-4 '} />
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
												<!-- Para estilizar linhas especificas voce vincula ao nome da dado do Database -->
												{#if cell.id === 'status'}
													<!-- Esse erro tem a ver com a tipagem do cell.value nao mexer -->
													{#if cell.value === 'Sendo Atendido'}
														<div class="text-yellow-600">
															<Render of={cell.render()} />
														</div>
													{:else}
														<Render of={cell.render()} />
													{/if}
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
			<div class="flex items-center justify-end space-x-4">
				<div class="flex-1 text-sm text-muted-foreground">
					{Object.keys($selectedDataIds).length} de{' '}
					{$rows.length} Colunas selecionadas.
				</div>
				<Button
					variant="outline"
					size="sm"
					on:click={() => ($pageIndex = $pageIndex - 1)}
					disabled={!$hasPreviousPage}>Anterior</Button
				>
				<Button
					variant="outline"
					size="sm"
					disabled={!$hasNextPage}
					on:click={() => ($pageIndex = $pageIndex + 1)}>Proximo</Button
				>
			</div>
		</Tabs.Content>
		<Tabs.Content value="finalizados">
			<div class="rounded-md border border-secondary">
				<Table.Root {...$tableAttrs}>
					<Table.Header>
						{#each $headerRows as headerRow}
							<Subscribe rowAttrs={headerRow.attrs()}>
								<Table.Row>
									{#each headerRow.cells as cell (cell.id)}
										<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
											<Table.Head {...attrs} class="[&:has([role=checkbox])]:pl-3">
												{#if cell.id === 'status'}
													<Button variant="ghost" on:click={props.sort.toggle}>
														<Render of={cell.render()} />
														<ArrowUpDown class={'ml-2  h-4 w-4 '} />
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
												<!-- Para estilizar linhas especificas voce vincula ao nome da dado do Database -->
												{#if cell.id === 'status'}
													<!-- Esse erro tem a ver com a tipagem do cell.value nao mexer -->
													{#if cell.value === 'Sendo Atendido'}
														<div class="text-yellow-600">
															<Render of={cell.render()} />
														</div>
													{:else}
														<Render of={cell.render()} />
													{/if}
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
			<div class="flex items-center justify-end space-x-4">
				<div class="flex-1 text-sm text-muted-foreground">
					{Object.keys($selectedDataIds).length} de{' '}
					{$rows.length} Colunas selecionadas.
				</div>
				<Button
					variant="outline"
					size="sm"
					on:click={() => ($pageIndex = $pageIndex - 1)}
					disabled={!$hasPreviousPage}>Anterior</Button
				>
				<Button
					variant="outline"
					size="sm"
					disabled={!$hasNextPage}
					on:click={() => ($pageIndex = $pageIndex + 1)}>Proximo</Button
				>
			</div>
		</Tabs.Content>
		<Tabs.Content value="sem sucesso">
			<div class="rounded-md border border-secondary">
				<Table.Root {...$tableAttrs}>
					<Table.Header>
						{#each $headerRows as headerRow}
							<Subscribe rowAttrs={headerRow.attrs()}>
								<Table.Row>
									{#each headerRow.cells as cell (cell.id)}
										<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
											<Table.Head {...attrs} class="[&:has([role=checkbox])]:pl-3">
												{#if cell.id === 'status'}
													<Button variant="ghost" on:click={props.sort.toggle}>
														<Render of={cell.render()} />
														<ArrowUpDown class={'ml-2  h-4 w-4 '} />
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
												<!-- Para estilizar linhas especificas voce vincula ao nome da dado do Database -->
												{#if cell.id === 'status'}
													<!-- Esse erro tem a ver com a tipagem do cell.value nao mexer -->
													{#if cell.value === 'Sendo Atendido'}
														<div class="text-yellow-600">
															<Render of={cell.render()} />
														</div>
													{:else}
														<Render of={cell.render()} />
													{/if}
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
			<div class="flex items-center justify-end space-x-4">
				<div class="flex-1 text-sm text-muted-foreground">
					{Object.keys($selectedDataIds).length} de{' '}
					{$rows.length} Colunas selecionadas.
				</div>
				<Button
					variant="outline"
					size="sm"
					on:click={() => ($pageIndex = $pageIndex - 1)}
					disabled={!$hasPreviousPage}>Anterior</Button
				>
				<Button
					variant="outline"
					size="sm"
					disabled={!$hasNextPage}
					on:click={() => ($pageIndex = $pageIndex + 1)}>Proximo</Button
				>
			</div>
		</Tabs.Content>
	</div>
</Tabs.Root>
