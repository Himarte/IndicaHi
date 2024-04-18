<script lang="ts">
	import DataTable from '../../../../lib/components/ui/data-table/data-table.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<DataTable />
