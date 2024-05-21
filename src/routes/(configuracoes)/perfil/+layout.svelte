<script lang="ts">
	import SideBarUser from '$lib/components/NavBar/SideBarUser.svelte';
</script>

<dir class="flex h-full w-full flex-col bg-secondary pl-10">
	<div class="flex h-full w-full py-5">
		<SideBarUser />
		<div class="flex h-full w-full flex-col gap-5 pr-6">
			<slot><!-- optional fallback --></slot>
		</div>
	</div>
</dir>
