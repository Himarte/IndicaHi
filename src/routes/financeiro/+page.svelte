<script lang="ts">
	import DataTableAguardandoPagamento from '$lib/components/tables_financeiro/TablePendentes.svelte';
	import DataTablePagos from '$lib/components/tables_financeiro/TablePagos.svelte';
	import type { PageData } from './$types';
	import * as Tabs from '$lib/components/ui/tabs';

	export let data: PageData;
</script>

{#if data.leads.aguardandoPagamento.length === 0}
	<div class="flex w-full justify-center p-8 text-lg text-red-500">
		Nenhum lead aguardando pagamento encontrado
	</div>
{:else}
	<Tabs.Root value="aguardandoPagamento" class="relative h-full w-full px-3 md:px-10">
		<Tabs.List class="absolute top-2 flex w-min gap-1 border border-secondary bg-background">
			<Tabs.Trigger value="aguardandoPagamento">Aguardando Pagamento</Tabs.Trigger>
			<Tabs.Trigger value="pagos">Pagos</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content class="pt-10" value="aguardandoPagamento">
			<DataTableAguardandoPagamento leads={data.leads.aguardandoPagamento} />
		</Tabs.Content>
		<Tabs.Content class="pt-10" value="pagos">
			<DataTablePagos leads={data.leads.pagos} />
		</Tabs.Content>
	</Tabs.Root>
{/if}
