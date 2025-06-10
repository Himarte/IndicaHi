<script lang="ts">
	import TableBase from '$lib/components/tables_financeiro/TableBase.svelte';
	import type { PageData } from './$types';
	import * as Tabs from '$lib/components/ui/tabs';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let cargo = data.user?.job as string;
</script>

<Tabs.Root value="aguardandoPagamento" class="relative flex h-full w-full justify-center pt-5">
	<Tabs.List
		class="bg-background border-border absolute top-2 left-1/2 flex w-min -translate-x-1/2 gap-2 border"
	>
		<Tabs.Trigger
			value="aguardandoPagamento"
			class=" data-[state=active]:bg-zinc-600 data-[state=active]:ring-red-500"
		>
			Aguardando Pagamento
		</Tabs.Trigger>
		<Tabs.Trigger
			value="pagos"
			class="data-[state=active]:border-red-500 data-[state=active]:bg-zinc-600"
		>
			Pagos
		</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content class="w-full pt-10" value="aguardandoPagamento">
		<TableBase leads={data.leads?.aguardandoPagamento} status="Aguardando Pagamento" {cargo} />
	</Tabs.Content>

	<Tabs.Content class="w-full pt-10" value="pagos">
		<TableBase leads={data.leads?.pagos} status="Pago" {cargo} />
	</Tabs.Content>
</Tabs.Root>
