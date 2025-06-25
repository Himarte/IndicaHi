<script lang="ts">
	import TableBase from '$lib/components/tables_interno/TableBase.svelte';
	import type { PageData } from './$types';
	import * as Tabs from '$lib/components/ui/tabs';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Derived values para melhor performance
	let cargo = $derived(data.user?.job || '');
</script>

<Tabs.Root value="pendentes" class="relative flex h-full w-full justify-center pt-3 md:pt-5">
	<Tabs.List
		class="bg-background border-border absolute top-3 left-1/2 flex w-min -translate-x-1/2 gap-1 rounded-lg border px-1 py-1 md:top-2 md:gap-2"
	>
		<Tabs.Trigger
			value="pendentes"
			class="rounded-md px-2 py-1.5 text-xs data-[state=active]:bg-zinc-800 md:px-3 md:py-2 md:text-sm"
		>
			<span class="hidden sm:inline">Pendentes</span>
			<span class="sm:hidden">Pend.</span>
		</Tabs.Trigger>
		<Tabs.Trigger
			value="atendimento"
			class="rounded-md px-2 py-1.5 text-xs data-[state=active]:bg-zinc-800 md:px-3 md:py-2 md:text-sm"
		>
			<span class="hidden sm:inline">Em Atendimento</span>
			<span class="sm:hidden">Atend.</span>
		</Tabs.Trigger>
		<Tabs.Trigger
			value="finalizados"
			class="rounded-md px-2 py-1.5 text-xs data-[state=active]:bg-zinc-800 md:px-3 md:py-2 md:text-sm"
		>
			<span class="hidden sm:inline">Finalizados</span>
			<span class="sm:hidden">Final.</span>
		</Tabs.Trigger>
		<Tabs.Trigger
			value="cancelados"
			class="rounded-md px-2 py-1.5 text-xs data-[state=active]:bg-zinc-800 md:px-3 md:py-2 md:text-sm"
		>
			<span class="hidden sm:inline">Cancelados</span>
			<span class="sm:hidden">Canc.</span>
		</Tabs.Trigger>
	</Tabs.List>

	<Tabs.Content class="h-full w-full pt-8 md:pt-10" value="pendentes">
		<TableBase leads={data.leads.pendentes} {cargo} status="Pendente" />
	</Tabs.Content>

	<Tabs.Content class="h-full w-full pt-8 md:pt-10" value="atendimento">
		<TableBase leads={data.leads.emAtendimento} {cargo} status="Sendo Atendido" />
	</Tabs.Content>

	<Tabs.Content class="h-full w-full pt-8 md:pt-10" value="finalizados">
		<TableBase leads={data.leads.finalizados} {cargo} status="Finalizado" />
	</Tabs.Content>

	<Tabs.Content class="h-full w-full pt-8 md:pt-10" value="cancelados">
		<TableBase leads={data.leads.cancelados} {cargo} status="Cancelado" />
	</Tabs.Content>
</Tabs.Root>
