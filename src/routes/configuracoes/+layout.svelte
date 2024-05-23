<script lang="ts">
	import SideBarUser from '$lib/components/NavBar/SideBarUser.svelte';
</script>

<dir class="flex h-full w-full pl-10">
	<SideBarUser />
	<div class="flex h-full w-full flex-col gap-5 pr-10">
		<slot><!-- optional fallback --></slot>
	</div>
</dir>
