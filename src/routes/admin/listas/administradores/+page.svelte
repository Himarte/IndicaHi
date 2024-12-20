<script lang="ts">
	import type { PageData } from './types';
	import * as Table from '$lib/components/ui/table';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { formatarCPF, formatarTelefone, formatarData } from '$lib/uteis/masks';

	export let data: PageData;

	let searchTerm = '';
	$: filteredAdmins =
		data.administradores?.filter((admin) =>
			admin.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
		<h1 class="text-2xl font-bold">Administradores</h1>
		<div class="flex gap-2">
			<Input placeholder="Buscar por nome..." bind:value={searchTerm} class="w-64" />
			<Button variant="outline">Adicionar Administrador</Button>
		</div>
	</div>

	{#if data.error}
		<div class="flex h-[50vh] items-center justify-center text-destructive">
			<p>{data.error}</p>
		</div>
	{:else if !data.administradores || data.administradores.length === 0}
		<div class="flex h-[50vh] items-center justify-center">
			<p>Nenhum administrador encontrado</p>
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
					{#each filteredAdmins as admin}
						<Table.Row>
							<Table.Cell>{admin.name || '-'}</Table.Cell>
							<Table.Cell>{admin.email || '-'}</Table.Cell>
							<Table.Cell>{formatarValorSeguro(admin.telefone, formatarTelefone)}</Table.Cell>
							<Table.Cell>{formatarValorSeguro(admin.cpf, formatarCPF)}</Table.Cell>
							<Table.Cell>{formatarData(admin.criadoEm)}</Table.Cell>
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
