<script lang="ts">
	import { Badge } from '../ui/badge';
	import Separator from '../ui/separator/separator.svelte';
	import DropdownDashboard from '$lib/components/Dropdown-dashboard.svelte';
</script>

<div class="relative mt-20 flex w-[40%] items-center gap-12 rounded-lg bg-zinc-800 p-2 text-white">
	<Badge class="absolute -top-3 right-2 w-20 bg-red-600 text-white hover:bg-red-600">Pendente</Badge
	>
	<div class="flex flex-col gap-2 pl-4">
		<h1 class="text-lg font-semibold">Joao da Silva</h1>
		<h2>Tel: "telefone"</h2>
	</div>
	<Separator orientation="vertical" class="h-14 bg-red-50 text-center" />
	<div class="flex flex-col gap-2">
		<h2 class="text-xs">Criado em: <span class="font-semibold">"Data"</span></h2>
		<h2>PromoCode: <span class="font-semibold">"codigo"</span></h2>
	</div>
	<DropdownDashboard />
</div>
