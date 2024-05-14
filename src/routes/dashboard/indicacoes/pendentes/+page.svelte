<script lang="ts">
	import DataTable from '$lib/components/ui/data-table-v-externo/data-table.svelte';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	const leads = data.leads;
</script>

{#await leads}
	<p>Carregando...</p>
{:then leads}
	<DataTable {leads} />
{:catch error}
	<p>{error.message}</p>
{/await}
