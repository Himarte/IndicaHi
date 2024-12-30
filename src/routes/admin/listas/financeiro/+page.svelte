<script lang="ts">
	import type { PageData } from './types';
	import * as Table from '$lib/components/ui/table';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { formatarCPF, formatarTelefone, formatarData } from '$lib/uteis/masks';

	export let data: PageData;

	let searchTerm = '';
	$: filteredUsuarios =
		data.usuarios?.filter((usuario: { name: string }) =>
			usuario.name?.toLowerCase().includes(searchTerm.toLowerCase())
		) || [];

	const formatarValorSeguro = (
		valor: string | null | undefined,
		formatarFn: (v: string) => string
	): string => {
		if (!valor) return '-';
		return formatarFn(valor);
	};
</script>

<div class="flex h-full w-full flex-col gap-4 p-4">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold">Usuários do Financeiro</h1>
		<div class="flex gap-2">
			<Input placeholder="Buscar por nome..." bind:value={searchTerm} class="w-96" />
		</div>
	</div>

	{#if data.error}
		<div class="flex h-[50vh] items-center justify-center text-destructive">
			<p>{data.error}</p>
		</div>
	{:else if !data.usuarios || data.usuarios.length === 0}
		<div class="flex h-[50vh] items-center justify-center">
			<p>Nenhum usuário do financeiro encontrado</p>
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
					{#each filteredUsuarios as usuario}
						<Table.Row>
							<Table.Cell>{usuario.name || '-'}</Table.Cell>
							<Table.Cell>{usuario.email || '-'}</Table.Cell>
							<Table.Cell>{formatarValorSeguro(usuario.telefone, formatarTelefone)}</Table.Cell>
							<Table.Cell>{formatarValorSeguro(usuario.cpf, formatarCPF)}</Table.Cell>
							<Table.Cell>{formatarData(usuario.criadoEm)}</Table.Cell>
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
