<script lang="ts">
	import TableBase from '$lib/components/tables_financeiro/TableBase.svelte';
	import type { PageData } from './$types';
	import * as Tabs from '$lib/components/ui/tabs';

	export let data: PageData;
	let cargo = data.user?.job as string;
</script>

<Tabs.Root value="aguardandoPagamento" class="relative flex h-full w-full justify-center pt-5">
	<Tabs.List class="absolute top-3 flex w-min gap-1 border border-secondary bg-background">
		<Tabs.Trigger value="aguardandoPagamento" class="data-[state=active]:bg-zinc-800">
			Aguardando Pagamento
		</Tabs.Trigger>
		<Tabs.Trigger value="pagos" class="data-[state=active]:bg-zinc-800">Pagos</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content class="w-full pt-10" value="aguardandoPagamento">
		<TableBase leads={data.leads?.aguardandoPagamento} status="Aguardando Pagamento" {cargo} />
	</Tabs.Content>

	<Tabs.Content class="w-full pt-10" value="pagos">
		<TableBase leads={data.leads?.pagos} status="Pago" {cargo} />
	</Tabs.Content>
</Tabs.Root>
