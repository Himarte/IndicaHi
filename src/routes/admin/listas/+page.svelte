<script lang="ts">
	import TableBase from '$lib/components/tables_admin/listas/TableBase.svelte';
	import type { PageData } from './$types';
	import * as Tabs from '$lib/components/ui/tabs';

	export let data: PageData;
</script>

<Tabs.Root value="vendedores-internos" class="relative flex h-full w-full justify-center pt-5 ">
	<Tabs.List class="absolute top-3 flex w-min gap-1  border border-secondary bg-background">
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

	<Tabs.Content class="w-full pt-10" value="vendedores-internos">
		<TableBase usuarios={data.usuarios.vendedoresInternos} tipo="vendedor-interno" />
	</Tabs.Content>

	<Tabs.Content class="w-full pt-10" value="vendedores-externos">
		<TableBase usuarios={data.usuarios.vendedoresExternos} tipo="vendedor-externo" />
	</Tabs.Content>

	<Tabs.Content class="w-full pt-10" value="administradores">
		<TableBase usuarios={data.usuarios.administradores} tipo="administrador" />
	</Tabs.Content>

	<Tabs.Content class="w-full pt-10" value="financeiro">
		<TableBase usuarios={data.usuarios.financeiro} tipo="financeiro" />
	</Tabs.Content>
</Tabs.Root>
