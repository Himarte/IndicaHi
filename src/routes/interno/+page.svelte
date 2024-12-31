<script lang="ts">
	import TableBase from '$lib/components/tables_interno/TableBase.svelte';
	import type { PageData } from './$types';
	import * as Tabs from '$lib/components/ui/tabs';

	export let data: PageData;
	export let cargo = data.user?.job || '';
</script>

<Tabs.Root value="pendentes" class="relative flex h-full w-full justify-center pt-5">
	<Tabs.List class="absolute top-3 flex w-min gap-1 border border-secondary bg-background">
		<Tabs.Trigger value="pendentes" class="data-[state=active]:bg-zinc-800">Pendentes</Tabs.Trigger>
		<Tabs.Trigger value="atendimento" class="data-[state=active]:bg-zinc-800"
			>Em Atendimento</Tabs.Trigger
		>
		<Tabs.Trigger value="finalizados" class="data-[state=active]:bg-zinc-800"
			>Finalizados</Tabs.Trigger
		>
		<Tabs.Trigger value="cancelados" class="data-[state=active]:bg-zinc-800"
			>Cancelados</Tabs.Trigger
		>
	</Tabs.List>

	<Tabs.Content class="w-full pt-10" value="pendentes">
		<TableBase leads={data.leads.pendentes} {cargo} status="Pendente" />
	</Tabs.Content>

	<Tabs.Content class="w-full pt-10" value="atendimento">
		<TableBase leads={data.leads.emAtendimento} {cargo} status="Sendo Atendido" />
	</Tabs.Content>

	<Tabs.Content class="w-full pt-10" value="finalizados">
		<TableBase leads={data.leads.finalizados} {cargo} status="Finalizado" />
	</Tabs.Content>

	<Tabs.Content class="w-full pt-10" value="cancelados">
		<TableBase leads={data.leads.cancelados} {cargo} status="Sem Sucesso" />
	</Tabs.Content>
</Tabs.Root>
