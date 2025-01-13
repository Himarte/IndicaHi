<script lang="ts">
	import TableBase from '$lib/components/tables_admin/leads/TableBase.svelte';
	import type { PageData } from './$types';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Circle3 } from 'svelte-loading-spinners';

	export let data: PageData;
</script>

<Tabs.Root value="pendentes" class="relative flex h-full w-full justify-center pt-5">
	<Tabs.List class="absolute top-3 flex w-min gap-1 border border-secondary bg-background">
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
		<div class="flex h-[80vh] w-full items-center justify-center">
			<Circle3
				size="70"
				ballBottomLeft="#F97316"
				ballBottomRight="#FAFAFA"
				ballTopLeft="#FAFAFA"
				ballTopRight="#F97316"
			/>
		</div>
	{:then leads}
		<Tabs.Content class="w-full pt-10" value="pendentes">
			<TableBase leads={leads.pendentes} />
		</Tabs.Content>

		<Tabs.Content class="w-full pt-10" value="em-atendimento">
			<TableBase leads={leads.emAtendimento} />
		</Tabs.Content>

		<Tabs.Content class="w-full pt-10" value="aguardando-pagamento">
			<TableBase leads={leads.aguardandoPagamento} />
		</Tabs.Content>

		<Tabs.Content class="w-full pt-10" value="pagos">
			<TableBase leads={leads.pagos} />
		</Tabs.Content>

		<Tabs.Content class="w-full pt-10" value="finalizados">
			<TableBase leads={leads.finalizados} />
		</Tabs.Content>

		<Tabs.Content class="w-full pt-10" value="cancelados">
			<TableBase leads={leads.cancelados} />
		</Tabs.Content>
	{:catch error}
		<div class="flex w-full justify-center p-8 text-lg text-red-500">
			Erro ao carregar leads: {error.message}
		</div>
	{/await}
</Tabs.Root>
