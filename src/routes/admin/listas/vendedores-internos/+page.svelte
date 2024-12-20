<script lang="ts">
	import type { PageData } from './$types';
	import * as Table from '$lib/components/ui/table';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { formatarCPF, formatarTelefone, formatarData } from '$lib/uteis/masks';

	export let data: PageData;

	let searchTerm = '';
	$: filteredVendedores =
		data.vendedores?.filter((vendedor) =>
			vendedor.name?.toLowerCase().includes(searchTerm.toLowerCase())
		) || [];

	// Função de segurança para valores nulos/undefined
	const formatarValorSeguro = (
		valor: string | null | undefined,
		formatarFn: (v: string) => string
	): string => {
		if (!valor) return '-';
		return formatarFn(valor);
	};
</script>

<div class="flex h-full w-full flex-col gap-4 p-5">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold">Vendedores Internos</h1>
		<div class="flex gap-2">
			<Input placeholder="Buscar por nome..." bind:value={searchTerm} class="w-96 " />
		</div>
	</div>

	{#if data.error}
		<div class="flex h-[50vh] items-center justify-center text-destructive">
			<p>{data.error}</p>
		</div>
	{:else if !data.vendedores || data.vendedores.length === 0}
		<div class="flex h-[50vh] items-center justify-center">
			<p>Nenhum vendedor interno encontrado</p>
		</div>
	{:else}
		<div class="rounded-md border border-border">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Nome</Table.Head>
						<Table.Head>Email</Table.Head>
						<Table.Head>Telefone</Table.Head>
						<Table.Head>CPF</Table.Head>
						<Table.Head>Data de Cadastro</Table.Head>
						<Table.Head>Ações</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each filteredVendedores as vendedor}
						<Table.Row>
							<Table.Cell>{vendedor.name || '-'}</Table.Cell>
							<Table.Cell>{vendedor.email || '-'}</Table.Cell>
							<Table.Cell>{formatarValorSeguro(vendedor.telefone, formatarTelefone)}</Table.Cell>
							<Table.Cell>{formatarValorSeguro(vendedor.cpf, formatarCPF)}</Table.Cell>
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
	{/if}
</div>
