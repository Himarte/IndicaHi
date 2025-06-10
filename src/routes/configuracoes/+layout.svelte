<script lang="ts">
	import SideBarUser from '$lib/components/layouts/SideBarUser.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="flex h-full w-full flex-col p-10 md:flex-row md:pt-10 md:pl-10">
	<SideBarUser />
	<div class="flex h-full w-full flex-col gap-5 md:pr-10">
		{@render children?.()}
	</div>
</div>
