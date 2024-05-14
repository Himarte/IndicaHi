<script lang="ts">
	import SideBar from '$lib/components/NavBar/SideBar.svelte';
	import type { LayoutData } from './$types';
	export let data: LayoutData;

	$: userRole = data.user?.job;
</script>

<div class="mt-5 flex gap-5 px-44">
	<SideBar {userRole} />
	<div class="w-full"><slot /></div>
</div>
