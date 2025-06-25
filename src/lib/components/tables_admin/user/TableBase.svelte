<script lang="ts">
	import {
		type ColumnDef,
		type ColumnFiltersState,
		type PaginationState,
		type SortingState,
		type VisibilityState,
		getCoreRowModel,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel
	} from '@tanstack/table-core';
	import { createRawSnippet } from 'svelte';
	import {
		FlexRender,
		createSvelteTable,
		renderSnippet
	} from '$lib/components/ui/data-table/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { formatarData, formatarTelefone } from '$lib/uteis/masks';
	import {
		ChevronLeftIcon,
		ChevronRightIcon,
		ChevronsLeftIcon,
		ChevronsRightIcon
	} from '@lucide/svelte';
	import type { UserSchema } from '$lib/server/database/schema';
	import SheetEditarUsuario from '$lib/components/Sheets/SheetEditarUsuario.svelte';

	interface Props {
		usuarios: UserSchema[];
		tipo: 'vendedor-interno' | 'vendedor-externo' | 'administrador' | 'financeiro';
	}

	let { usuarios, tipo }: Props = $props();

	// Estado para controlar qual usuário está sendo editado
	let usuarioSendoEditado = $state<UserSchema | null>(null);

	// Configuração de cores e labels por tipo
	const tipoConfig = {
		'vendedor-interno': {
			badgeColor: 'bg-blue-600 hover:bg-blue-600 text-white',
			label: 'Vendedor Interno',
			emptyMessage: 'Nenhum vendedor interno encontrado'
		},
		'vendedor-externo': {
			badgeColor: 'bg-green-600 hover:bg-green-600 text-white',
			label: 'Vendedor Externo',
			emptyMessage: 'Nenhum vendedor externo encontrado'
		},
		administrador: {
			badgeColor: 'bg-red-600 hover:bg-red-600 text-white',
			label: 'Administrador',
			emptyMessage: 'Nenhum administrador encontrado'
		},
		financeiro: {
			badgeColor: 'bg-yellow-600 hover:bg-yellow-600 text-white',
			label: 'Financeiro',
			emptyMessage: 'Nenhum usuário financeiro encontrado'
		}
	};

	// Definição das colunas da tabela
	const columns: ColumnDef<UserSchema>[] = [
		// Coluna Avatar + Nome
		{
			accessorKey: 'name',
			header: 'Usuário',
			cell: ({ row }) => {
				const avatarSnippet = createRawSnippet<[UserSchema]>((user) => {
					return {
						render: () => `
							<div class="flex items-center gap-3">
								<div class="relative">
									<img
										src="${user().avatarUrl || '/favicon.webp'}"
										alt="${user().name}"
										class="h-10 w-10 rounded-full object-cover"
										onerror="this.src='/favicon.webp'"
									/>
								</div>
								<div class="flex flex-col">
									<div class="font-medium text-gray-100">${user().name}</div>
									<div class="text-sm text-gray-400">${user().email}</div>
								</div>
							</div>
						`
					};
				});
				return renderSnippet(avatarSnippet, row.original);
			}
		},
		// Coluna Cargo
		{
			accessorKey: 'job',
			header: 'Cargo',
			cell: ({ row }) => {
				const badgeSnippet = createRawSnippet<[string]>((job) => {
					const config = tipoConfig[tipo];
					return {
						render: () => `
							<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.badgeColor}">
								${job()}
							</span>
						`
					};
				});
				return renderSnippet(badgeSnippet, row.getValue('job'));
			}
		},
		// Coluna Telefone
		{
			accessorKey: 'telefone',
			header: 'Telefone',
			cell: ({ row }) => {
				const telefoneSnippet = createRawSnippet<[string | null]>((telefone) => {
					const formatted = telefone() ? formatarTelefone(telefone()!) : 'Não informado';
					return {
						render: () => `<div class="text-sm text-gray-300">${formatted}</div>`
					};
				});
				return renderSnippet(telefoneSnippet, row.getValue('telefone'));
			},
			filterFn: (row, id, value) => {
				if (!value) return true;

				const telefoneOriginal = row.getValue(id) as string | null;
				if (!telefoneOriginal) return false;

				// Remove formatação de ambos os valores para comparação
				const telefoneClean = telefoneOriginal.replace(/\D/g, '');
				const searchClean = value.replace(/\D/g, '');

				// Verifica se o telefone contém a busca (números puros)
				// Ou se a versão formatada contém a busca (com formatação)
				const telefoneFormatted = formatarTelefone(telefoneOriginal);

				return (
					telefoneClean.includes(searchClean) ||
					telefoneFormatted.toLowerCase().includes(value.toLowerCase())
				);
			}
		},
		// Coluna Código Promocional
		{
			accessorKey: 'promoCode',
			header: 'Código Promocional',
			cell: ({ row }) => {
				const promoSnippet = createRawSnippet<[string | null]>((promo) => {
					const code = promo() || 'Não definido';
					return {
						render: () => `<div class="font-mono text-sm text-orange-400">${code}</div>`
					};
				});
				return renderSnippet(promoSnippet, row.getValue('promoCode'));
			}
		},
		// Coluna Data de Criação
		{
			accessorKey: 'criadoEm',
			header: 'Data de Criação',
			cell: ({ row }) => {
				const dataSnippet = createRawSnippet<[string | null]>((data) => {
					const formatted = data() ? formatarData(data()!) : 'Data não disponível';
					return {
						render: () => `<div class="text-sm text-gray-300">${formatted}</div>`
					};
				});
				return renderSnippet(dataSnippet, row.getValue('criadoEm'));
			}
		},
		// Coluna Status
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => {
				const statusSnippet = createRawSnippet<[boolean]>((status) => {
					const isActive = status();
					const statusClass = isActive
						? 'bg-green-900/50 text-green-400 border-green-700'
						: 'bg-red-900/50 text-red-400 border-red-700';
					const statusText = isActive ? 'Ativo' : 'Inativo';
					return {
						render: () => `
							<span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusClass}">
								${statusText}
							</span>
						`
					};
				});
				return renderSnippet(statusSnippet, row.getValue('status'));
			}
		},
		// Coluna Ações
		{
			id: 'actions',
			header: 'Ações',
			cell: ({ row }) => {
				const actionsSnippet = createRawSnippet<[UserSchema]>((user) => {
					return {
						render: () => `
							<button
								class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-transparent p-0 text-orange-400 hover:bg-orange-600/20 hover:text-orange-300 transition-colors edit-user-btn"
								data-user-id="${user().id}"
								aria-label="Editar usuário"
							>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
								</svg>
							</button>
						`
					};
				});
				return renderSnippet(actionsSnippet, row.original);
			},
			enableSorting: false,
			enableHiding: false
		}
	];

	// Estados reativo do Svelte 5
	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnVisibility = $state<VisibilityState>({});

	// Criar a tabela
	const table = createSvelteTable({
		get data() {
			return usuarios;
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
		}
	});

	// Computed para informações da tabela
	const tableInfo = $derived({
		totalRows: table.getFilteredRowModel().rows.length,
		currentPage: table.getState().pagination.pageIndex + 1,
		totalPages: table.getPageCount(),
		pageSize: table.getState().pagination.pageSize,
		startRow: table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1,
		endRow: Math.min(
			(table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
			table.getFilteredRowModel().rows.length
		)
	});

	// Função simples para abrir o sheet de edição
	const abrirEdicao = (userId: string) => {
		const usuario = usuarios.find((u) => u.id === userId);
		if (usuario) {
			usuarioSendoEditado = usuario;
		}
	};

	// Event listener para botões de edição
	$effect(() => {
		if (typeof window !== 'undefined') {
			const handleEditClick = (e: Event) => {
				const target = e.target as HTMLElement;
				const button = target.closest('.edit-user-btn') as HTMLElement;
				if (button) {
					const userId = button.dataset.userId;
					if (userId) {
						abrirEdicao(userId);
					}
				}
			};

			document.addEventListener('click', handleEditClick);

			return () => {
				document.removeEventListener('click', handleEditClick);
			};
		}
	});
</script>

<div class="w-full space-y-4">
	<!-- Cabeçalho com filtros e controles -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<!-- Filtro de pesquisa por nome -->
		<div class="flex flex-1 items-center space-x-5">
			<Input
				placeholder="Pesquisar por nome..."
				value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
				onchange={(e) => table.getColumn('name')?.setFilterValue(e.currentTarget.value)}
				oninput={(e) => table.getColumn('name')?.setFilterValue(e.currentTarget.value)}
				class="max-w-sm border-zinc-700 bg-zinc-900 text-white placeholder:text-gray-400"
			/>

			<!-- Filtro de pesquisa por promo code -->
			<Input
				placeholder="Pesquisar por código promocional..."
				value={(table.getColumn('promoCode')?.getFilterValue() as string) ?? ''}
				onchange={(e) => table.getColumn('promoCode')?.setFilterValue(e.currentTarget.value)}
				oninput={(e) => table.getColumn('promoCode')?.setFilterValue(e.currentTarget.value)}
				class="max-w-sm border-zinc-700 bg-zinc-900 text-white placeholder:text-gray-400"
			/>
			<Input
				placeholder="Pesquisar por telefone..."
				value={(table.getColumn('telefone')?.getFilterValue() as string) ?? ''}
				onchange={(e) => table.getColumn('telefone')?.setFilterValue(e.currentTarget.value)}
				oninput={(e) => table.getColumn('telefone')?.setFilterValue(e.currentTarget.value)}
				class="max-w-sm border-zinc-700 bg-zinc-900 text-white placeholder:text-gray-400"
			/>
		</div>

		<!-- Indicador de total de registros -->
		<div class="ml-auto text-sm text-gray-400">
			Total: {table.getFilteredRowModel().rows.length} registros
		</div>
	</div>

	<!-- Tabela -->
	<div class="h-[80vh]">
		<div class="h-fit overflow-y-auto rounded-md border border-zinc-700 bg-zinc-900">
			<Table.Root>
				<Table.Header>
					{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
						<Table.Row class="border-zinc-700 hover:bg-zinc-800/50">
							{#each headerGroup.headers as header (header.id)}
								<Table.Head class="font-semibold text-orange-400">
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
					{#if table.getRowModel().rows?.length}
						{#each table.getRowModel().rows as row (row.id)}
							<Table.Row
								class="border-zinc-700 transition-colors hover:bg-zinc-800/30"
								data-state={row.getIsSelected() && 'selected'}
							>
								{#each row.getVisibleCells() as cell (cell.id)}
									<Table.Cell class="text-gray-200">
										<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
									</Table.Cell>
								{/each}
							</Table.Row>
						{/each}
					{:else}
						<Table.Row>
							<Table.Cell colspan={columns.length} class="h-24 text-center text-gray-400">
								{tipoConfig[tipo].emptyMessage}
							</Table.Cell>
						</Table.Row>
					{/if}
				</Table.Body>
			</Table.Root>
		</div>
	</div>

	<!-- Paginação e informações -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<!-- Informações da tabela -->
		<div class="text-sm text-gray-400">
			Mostrando {tableInfo.startRow} a {tableInfo.endRow} de {tableInfo.totalRows} resultado(s)
		</div>

		<!-- Controles de paginação -->
		<div class="flex items-center space-x-6 lg:space-x-8">
			<!-- Seletor de itens por página -->
			<div class="flex items-center space-x-2">
				<p class="text-sm font-medium text-gray-400">Linhas por página</p>
				<select
					value={table.getState().pagination.pageSize}
					onchange={(e) => table.setPageSize(Number(e.currentTarget.value))}
					class="h-8 w-[70px] rounded border border-zinc-700 bg-zinc-900 text-sm text-white"
				>
					{#each [10, 20, 30, 40, 50] as pageSize (pageSize)}
						<option value={pageSize}>{pageSize}</option>
					{/each}
				</select>
			</div>

			<!-- Navegação de páginas -->
			<div class="flex items-center space-x-2">
				<!-- Primeira página -->
				<Button
					variant="outline"
					class="hidden h-8 w-8 border-zinc-700 bg-zinc-900 p-0 hover:bg-zinc-800 lg:flex"
					onclick={() => table.setPageIndex(0)}
					disabled={!table.getCanPreviousPage()}
				>
					<span class="sr-only">Ir para primeira página</span>
					<ChevronsLeftIcon class="h-4 w-4" />
				</Button>

				<!-- Página anterior -->
				<Button
					variant="outline"
					class="h-8 w-8 border-zinc-700 bg-zinc-900 p-0 hover:bg-zinc-800"
					onclick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					<span class="sr-only">Ir para página anterior</span>
					<ChevronLeftIcon class="h-4 w-4" />
				</Button>

				<!-- Indicador de página atual -->
				<div class="flex w-[100px] items-center justify-center text-sm font-medium text-gray-400">
					Página {tableInfo.currentPage} de {tableInfo.totalPages}
				</div>

				<!-- Próxima página -->
				<Button
					variant="outline"
					class="h-8 w-8 border-zinc-700 bg-zinc-900 p-0 hover:bg-zinc-800"
					onclick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					<span class="sr-only">Ir para próxima página</span>
					<ChevronRightIcon class="h-4 w-4" />
				</Button>

				<!-- Última página -->
				<Button
					variant="outline"
					class="hidden h-8 w-8 border-zinc-700 bg-zinc-900 p-0 hover:bg-zinc-800 lg:flex"
					onclick={() => table.setPageIndex(table.getPageCount() - 1)}
					disabled={!table.getCanNextPage()}
				>
					<span class="sr-only">Ir para última página</span>
					<ChevronsRightIcon class="h-4 w-4" />
				</Button>
			</div>
		</div>
	</div>
</div>

<!-- Sheet para edição de usuário - Simples e direto -->
{#if usuarioSendoEditado}
	<SheetEditarUsuario
		usuario={usuarioSendoEditado}
		{tipo}
		open={usuarioSendoEditado}
		onClose={() => (usuarioSendoEditado = null)}
	/>
{/if}
