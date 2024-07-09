<script lang="ts">
	import DataTablePendentes from '$lib/components/ui/data-table-financeiro/data-table.svelte';

	import { Circle3 } from 'svelte-loading-spinners';
	import type { PageServerData } from './$types';
	import * as Tabs from '$lib/components/ui/tabs';
	export let data: PageServerData;
</script>

{#await data.userIndicadoresLeads}
	<div class="flex h-[80vh] w-full items-center justify-center">
		<Circle3
			size="70"
			ballBottomLeft="#F97316"
			ballBottomRight="#FAFAFA"
			ballTopLeft="#FAFAFA"
			ballTopRight="#F97316"
		/>
	</div>
{:then userIndicadoresLeads}
	<Tabs.Root value="pendentes" class="relative h-full w-full px-3 md:px-10">
		<Tabs.List class="absolute top-2 flex w-min gap-1 border border-secondary bg-background">
			<Tabs.Trigger value="pendentes">Pendentes</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="pendentes"><DataTablePendentes {userIndicadoresLeads} /></Tabs.Content>
	</Tabs.Root>
{:catch error}
	<p>{error.message}</p>
{/await}
