<script lang="ts">
	import DataTablePendentes from '$lib/components/tables_interno/TablePendentes.svelte';
	import DataTableAtendimento from '$lib/components/tables_interno/TableAtendimento.svelte';
	import DataTableFinalizados from '$lib/components/tables_interno/TableFinalizado.svelte';
	import DataTableCancelados from '$lib/components/tables_interno/TableCancelado.svelte';
	import type { PageServerData } from './$types';
	import { Circle3 } from 'svelte-loading-spinners';
	import * as Tabs from '$lib/components/ui/tabs';
	export let data: PageServerData;

	$: leadsInternos = data.LeadsInternos;
</script>

{#await data.LeadsInternos}
	<div class="flex h-[80vh] w-full items-center justify-center">
		<Circle3
			size="70"
			ballBottomLeft="#F97316"
			ballBottomRight="#FAFAFA"
			ballTopLeft="#FAFAFA"
			ballTopRight="#F97316"
		/>
	</div>
{:then leadsInternos}
	<Tabs.Root value="pendentes" class="relative h-full w-full px-[3.5rem]">
		<Tabs.List class="absolute top-2 flex w-min gap-1 border border-secondary bg-background">
			<Tabs.Trigger value="pendentes">Pendentes</Tabs.Trigger>
			<Tabs.Trigger value="atendimento">Sendo Atendido</Tabs.Trigger>
			<Tabs.Trigger value="finalizados">Finalizados</Tabs.Trigger>
			<Tabs.Trigger value="cancelados">Cancelados</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content class="pt-10" value="pendentes"
			><DataTablePendentes {leadsInternos} /></Tabs.Content
		>
		<Tabs.Content class="pt-10" value="atendimento"
			><DataTableAtendimento {leadsInternos} /></Tabs.Content
		>
		<Tabs.Content class="pt-10" value="finalizados"
			><DataTableFinalizados {leadsInternos} /></Tabs.Content
		>
		<Tabs.Content class="pt-10" value="cancelados"
			><DataTableCancelados {leadsInternos} /></Tabs.Content
		>
	</Tabs.Root>
{:catch error}
	<p>{error.message}</p>
{/await}
