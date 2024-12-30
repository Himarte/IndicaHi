<script lang="ts">
	import DataTablePendentes from '$lib/components/tables_externo/TablePendentes-externo.svelte';
	import DataTableAtendimento from '$lib/components/tables_externo/TableAtendimento-externo.svelte';
	import DataTableFinalizados from '$lib/components/tables_externo/TableFinalizado-externo.svelte';
	import DataTableCancelados from '$lib/components/tables_externo/TableCancelado-externo.svelte';
	import type { PageData } from './$types';
	import * as Tabs from '$lib/components/ui/tabs';

	export let data: PageData;
</script>

{#if data.message}
	<div class="flex w-full justify-center p-8 text-lg text-red-500">
		{data.message}
	</div>
{:else}
	<Tabs.Root value="pendentes" class="relative flex h-full w-full justify-center pt-5 ">
		<Tabs.List class="absolute top-3 flex w-min gap-1  border border-secondary bg-background">
			<Tabs.Trigger value="pendentes">Pendentes</Tabs.Trigger>
			<Tabs.Trigger value="atendimento">Em Atendimento</Tabs.Trigger>
			<Tabs.Trigger value="finalizados">Finalizados</Tabs.Trigger>
			<Tabs.Trigger value="cancelados">Cancelados</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content class="w-full pt-10" value="pendentes">
			<DataTablePendentes leads={data.leads.pendentes} />
		</Tabs.Content>

		<Tabs.Content class="w-full pt-10" value="atendimento">
			<DataTableAtendimento leads={data.leads.emAtendimento} />
		</Tabs.Content>

		<Tabs.Content class="w-full pt-10" value="finalizados">
			<DataTableFinalizados leads={data.leads.finalizados} />
		</Tabs.Content>

		<Tabs.Content class="w-full pt-10" value="cancelados">
			<DataTableCancelados leads={data.leads.cancelados} />
		</Tabs.Content>
	</Tabs.Root>
{/if}
