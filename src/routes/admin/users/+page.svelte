<script lang="ts">
	import TableBase from '$lib/components/tables_admin/user/TableBase.svelte';
	import type { PageData } from './$types';
	import * as Tabs from '$lib/components/ui/tabs';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<Tabs.Root
	value="vendedores-internos"
	class="relative flex h-full w-full items-center justify-center pt-5 "
>
	<Tabs.List class="border-secondary bg-background absolute top-3  flex  w-min gap-2 border">
		<Tabs.Trigger value="vendedores-internos" class="data-[state=active]:bg-zinc-800"
			>Vendedores Internos</Tabs.Trigger
		>
		<Tabs.Trigger value="vendedores-externos" class="data-[state=active]:bg-zinc-800"
			>Vendedores Externos</Tabs.Trigger
		>
		<Tabs.Trigger value="administradores" class="data-[state=active]:bg-zinc-800"
			>Administradores</Tabs.Trigger
		>
		<Tabs.Trigger value="financeiro" class="data-[state=active]:bg-zinc-800"
			>Financeiro</Tabs.Trigger
		>
	</Tabs.List>

	{#await data.usuarios}
		<div class="flex h-[60vh] w-full items-center justify-center">
			<div class="flex flex-col items-center gap-4">
				<div class="relative">
					<div
						class="h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-orange-500"
					></div>
					<div
						class="absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-b-orange-400 [animation-direction:reverse] [animation-duration:1.5s]"
					></div>
				</div>
				<p class="text-sm text-slate-400">Carregando usuários...</p>
			</div>
		</div>
	{:then usuarios}
		<Tabs.Content class="w-full px-10 pt-10" value="vendedores-internos">
			<TableBase usuarios={usuarios.vendedoresInternos} tipo="vendedor-interno" />
		</Tabs.Content>

		<Tabs.Content class="w-full px-10 pt-10" value="vendedores-externos">
			<TableBase usuarios={usuarios.vendedoresExternos} tipo="vendedor-externo" />
		</Tabs.Content>

		<Tabs.Content class="w-full px-10 pt-10" value="administradores">
			<TableBase usuarios={usuarios.administradores} tipo="administrador" />
		</Tabs.Content>

		<Tabs.Content class="w-full px-10 pt-10" value="financeiro">
			<TableBase usuarios={usuarios.financeiro} tipo="financeiro" />
		</Tabs.Content>
	{:catch error}
		<div class="flex w-full justify-center p-8 text-lg text-red-500">
			Erro ao carregar usuários: {error.message}
		</div>
	{/await}
</Tabs.Root>
