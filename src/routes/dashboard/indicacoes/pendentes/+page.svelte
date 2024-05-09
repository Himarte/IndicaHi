<script lang="ts">
	import DataTable from '$lib/components/ui/data-table-v-externo/data-table.svelte';
	import { Circle3 } from 'svelte-loading-spinners';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

{#await data.leads}
	<div class="flex h-screen w-full items-center justify-center">
		<Circle3
			size="70"
			ballBottomLeft="#F97316"
			ballBottomRight="#FAFAFA"
			ballTopLeft="#FAFAFA"
			ballTopRight="#F97316"
		/>
	</div>
{:then leads}
	<DataTable {leads} />
{:catch error}
	<p>{error.message}</p>
{/await}
