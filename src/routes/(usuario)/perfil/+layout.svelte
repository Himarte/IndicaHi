<script lang="ts">
	import SideBarUser from '$lib/components/NavBar/SideBarUser.svelte';
	import { Separator } from '$lib/components/ui/separator';
</script>

<h1 class="px-72 py-7 text-3xl font-medium">Dados da sua conta</h1>
<Separator />
<div class="flex h-full w-full px-72 py-5">
	<SideBarUser />

	<div class="flex h-full w-full flex-col gap-5">
		<slot><!-- optional fallback --></slot>
	</div>
</div>
