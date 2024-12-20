<script lang="ts">
	import type { PageData } from './$types';
	import * as Table from '$lib/components/ui/table';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { formatarCPF, formatarTelefone, formatarData } from '$lib/uteis/masks';
	import Pagination from '$lib/components/ui/pagination/pagination.svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { debounce } from 'lodash-es';

	export let data: PageData;

	let searchTerm = $page.url.searchParams.get('search') || '';
	let currentPage = parseInt($page.url.searchParams.get('page') || '1');

	const debouncedSearch = debounce(async (term: string) => {
		if (!browser) return;

		const url = new URL(window.location.href);
		url.searchParams.set('search', term);
		url.searchParams.set('page', '1');
		window.history.pushState({}, '', url.toString());

		// Força um recarregamento dos dados
		await window.location.reload();
	}, 300);

	$: if (searchTerm !== $page.url.searchParams.get('search')) {
		debouncedSearch(searchTerm);
	}

	async function handlePageChange(newPage: number) {
		if (!browser) return;

		const url = new URL(window.location.href);
		url.searchParams.set('page', newPage.toString());
		window.history.pushState({}, '', url.toString());

		// Força um recarregamento dos dados
		await window.location.reload();
	}
</script>

<div class="flex h-full w-full flex-col gap-4 p-4">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold">Vendedores Externos</h1>
		<div class="flex gap-2">
			<Input placeholder="Buscar por nome..." bind:value={searchTerm} class="w-64" />
			<Button variant="outline">Adicionar Vendedor</Button>
		</div>
	</div>

	{#if data.error}
		<div class="flex h-[50vh] items-center justify-center text-destructive">
			<p>{data.error}</p>
		</div>
	{:else if !data.vendedores || data.vendedores.length === 0}
		<div class="flex h-[50vh] items-center justify-center">
			<p>Nenhum vendedor externo encontrado</p>
		</div>
	{:else if data.vendedores.length > 0}
		<div class="flex flex-col gap-4">
			<div class="rounded-md border border-border">
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Nome</Table.Head>
							<Table.Head>Email</Table.Head>
							<Table.Head>Telefone</Table.Head>
							<Table.Head>CPF</Table.Head>
							<Table.Head>Código Promo</Table.Head>
							<Table.Head>Data de Cadastro</Table.Head>
							<Table.Head>Ações</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each data.vendedores as vendedor}
							<Table.Row>
								<Table.Cell>{vendedor.name || '-'}</Table.Cell>
								<Table.Cell>{vendedor.email || '-'}</Table.Cell>
								<Table.Cell>{formatarTelefone(vendedor.telefone || '')}</Table.Cell>
								<Table.Cell>{formatarCPF(vendedor.cpf || '')}</Table.Cell>
								<Table.Cell>{vendedor.promoCode || '-'}</Table.Cell>
								<Table.Cell>{formatarData(vendedor.criadoEm)}</Table.Cell>
								<Table.Cell>
									<div class="flex gap-2">
										<Button variant="ghost" size="sm">Editar</Button>
										<Button variant="ghost" size="sm" class="text-destructive">Remover</Button>
									</div>
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>

			<div class="mt-4 flex justify-center">
				<Pagination
					{currentPage}
					totalPages={data.pagination?.totalPages || 1}
					onPageChange={handlePageChange}
				/>
			</div>
		</div>
	{/if}
</div>
