<script lang="ts">
	import DataTablePendentes from '$lib/components/ui/data-table-v-externo/table-pendentes.svelte';
	import DataTableFinalizados from '$lib/components/ui/data-table-v-externo/table-finalizados.svelte';
	import DataTableSendoAtendido from '$lib/components/ui/data-table-v-externo/table-sendo-atendido.svelte';
	import DataTableCancelados from '$lib/components/ui/data-table-v-externo/table-cancelados.svelte';
	import { Circle3 } from 'svelte-loading-spinners';
	import type { PageServerData } from './$types';
	import * as Tabs from '$lib/components/ui/tabs';
	export let data: PageServerData;
</script>

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
	<Tabs.Root value="pendentes" class="relative h-full w-full pl-[3.5rem]">
		<Tabs.List class="absolute top-2 flex w-min gap-1 border border-secondary bg-background">
			<Tabs.Trigger value="pendentes">Pendentes</Tabs.Trigger>
			<Tabs.Trigger value="finalizados">Finalizados</Tabs.Trigger>
			<Tabs.Trigger value="sendo atendido">Sendo Atendido</Tabs.Trigger>
			<Tabs.Trigger value="cancelados">Cancelados</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="pendentes"><DataTablePendentes {leads} /></Tabs.Content>
		<Tabs.Content value="finalizados"><DataTableFinalizados {leads} /></Tabs.Content>
		<Tabs.Content value="sendo atendido"><DataTableSendoAtendido {leads} /></Tabs.Content>
		<Tabs.Content value="cancelados"><DataTableCancelados {leads} /></Tabs.Content>
	</Tabs.Root>
{:catch error}
	<p>{error.message}</p>
{/await}
