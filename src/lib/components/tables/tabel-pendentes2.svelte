<script lang="ts">
	import { Badge } from '../ui/badge';
	import Separator from '../ui/separator/separator.svelte';
	import DropdownDashboard from '$lib/components/Dropdown-dashboard.svelte';
	import type { LeadsSchema } from '$lib/server/database/schema';
	import { formatarData } from '$lib/uteis/masks';

	export let leads: LeadsSchema[];
	// Filtra apenas os leads com status Pendente
	$: leadsPendentes = leads.filter((lead) => lead.status === 'Pendente');
</script>

<div class="flex w-full flex-wrap gap-10 pt-4">
	{#each leadsPendentes as lead}
		<div class="relative flex w-[45%] items-center gap-6 rounded-lg bg-zinc-800 p-4 text-white">
			<Badge class="absolute -top-3 right-2 w-20 bg-red-600 text-white hover:bg-red-600">
				Pendente
			</Badge>

			<div class="flex flex-col gap-2 pl-4">
				<h1 class="text-lg font-semibold">{lead.fullName}</h1>
				<h2>Tel: {lead.telefone}</h2>
			</div>

			<Separator orientation="vertical" class="h-14 bg-zinc-600 text-center" />

			<div class="flex flex-col gap-2">
				<h2 class="text-xs">
					Criado em: <span class="font-semibold">{formatarData(lead.criadoEm ?? '')}</span>
				</h2>
				<h2>
					PromoCode: <span class="font-semibold">{lead.promoCode}</span>
				</h2>
			</div>
			<DropdownDashboard {lead} />
		</div>
	{/each}
</div>
