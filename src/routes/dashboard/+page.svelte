<script lang="ts">
	import DataTablePendentes from '$lib/components/tables/TablePendentes-externo.svelte';
	import DataTableAtendimento from '$lib/components/tables/TableAtendimento-externo.svelte';
	import DataTableFinalizados from '$lib/components/tables/TableFinalizado-externo.svelte';
	import DataTableCancelados from '$lib/components/tables/TableCancelado-externo.svelte';
	import type { PageServerData } from './$types';
	import { Circle3 } from 'svelte-loading-spinners';
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
	<Tabs.Root value="pendentes" class="relative h-full w-full px-[3.5rem]">
		<Tabs.List class="absolute top-2 flex w-min gap-1 border border-secondary bg-background">
			<Tabs.Trigger value="pendentes">Pendentes</Tabs.Trigger>
			<Tabs.Trigger value="atendimento">Sendo Atendido</Tabs.Trigger>
			<Tabs.Trigger value="finalizados">Finalizados</Tabs.Trigger>
			<Tabs.Trigger value="cancelados">Cancelados</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content class="pt-10" value="pendentes"><DataTablePendentes {leads} /></Tabs.Content>
		<Tabs.Content class="pt-10" value="atendimento"><DataTableAtendimento {leads} /></Tabs.Content>
		<Tabs.Content class="pt-10" value="finalizados"><DataTableFinalizados {leads} /></Tabs.Content>
		<Tabs.Content class="pt-10" value="cancelados"><DataTableCancelados {leads} /></Tabs.Content>
	</Tabs.Root>
{:catch error}
	<p>{error.message}</p>
{/await}
