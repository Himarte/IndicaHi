<script lang="ts">
	import TableBase from '$lib/components/tables_admin/leads/TableBase.svelte';
	import type { PageData } from './$types';
	import * as Tabs from '$lib/components/ui/tabs';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<Tabs.Root value="pendentes" class="relative flex h-full w-full items-center justify-center pt-5 ">
	<Tabs.List class="border-secondary bg-background absolute top-3  flex  w-min gap-2 border">
		<Tabs.Trigger value="pendentes" class="data-[state=active]:bg-zinc-800">Pendentes</Tabs.Trigger>
		<Tabs.Trigger value="em-atendimento" class="data-[state=active]:bg-zinc-800"
			>Em Atendimento</Tabs.Trigger
		>
		<Tabs.Trigger value="aguardando-pagamento" class="data-[state=active]:bg-zinc-800"
			>Aguardando Pagamento</Tabs.Trigger
		>
		<Tabs.Trigger value="finalizados" class="data-[state=active]:bg-zinc-800"
			>Finalizados</Tabs.Trigger
		>
		<Tabs.Trigger value="pagos" class="data-[state=active]:bg-zinc-800">Pagos</Tabs.Trigger>
		<Tabs.Trigger value="cancelados" class="data-[state=active]:bg-zinc-800"
			>Cancelados</Tabs.Trigger
		>
	</Tabs.List>

	{#await data.leads}
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
				<p class="text-sm text-slate-400">Carregando leads...</p>
			</div>
		</div>
	{:then leads}
		<Tabs.Content class="w-full px-10 pt-10" value="pendentes">
			<TableBase leads={leads.pendentes} status="pendentes" />
		</Tabs.Content>

		<Tabs.Content class="w-full px-10 pt-10" value="em-atendimento">
			<TableBase leads={leads.emAtendimento} status="em-atendimento" />
		</Tabs.Content>

		<Tabs.Content class="w-full px-10 pt-10" value="aguardando-pagamento">
			<TableBase leads={leads.aguardandoPagamento} status="aguardando-pagamento" />
		</Tabs.Content>

		<Tabs.Content class="w-full px-10 pt-10" value="pagos">
			<TableBase leads={leads.pagos} status="pagos" />
		</Tabs.Content>

		<Tabs.Content class="w-full px-10 pt-10" value="finalizados">
			<TableBase leads={leads.finalizados} status="finalizados" />
		</Tabs.Content>

		<Tabs.Content class="w-full px-10 pt-10" value="cancelados">
			<TableBase leads={leads.cancelados} status="cancelados" />
		</Tabs.Content>
	{:catch error}
		<div class="flex w-full justify-center p-8 text-lg text-red-500">
			Erro ao carregar leads: {error.message}
		</div>
	{/await}
</Tabs.Root>
