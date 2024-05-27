<script lang="ts">
	import NovaSide from '$lib/components/layouts/NovoSide.svelte';
	import type { LayoutData } from './$types';
	export let data: LayoutData;

	$: userRole = data.user?.job;
</script>

<main class="flex h-full w-full flex-col pl-14 pr-6 pt-5">
	<NovaSide />
	<slot />
</main>
