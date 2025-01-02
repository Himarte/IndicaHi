<script lang="ts">
	import { Badge } from '../ui/badge';
	import Separator from '../ui/separator/separator.svelte';
	import type { LeadsSchema } from '$lib/server/database/schema';
	import { formatarData } from '$lib/uteis/masks';
	import { CircleArrowLeftIcon, CircleArrowRight } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';

	export let leads: LeadsSchema[];
	export let status: 'Pendente' | 'Sendo Atendido' | 'Finalizado' | 'Sem Sucesso';

	// Configuração visual por status
	const statusConfig = {
		Pendente: {
			badgeColor: 'bg-red-600 hover:bg-red-600',
			badgeWidth: 'w-20',
			label: 'Pendente',
			emptyMessage: 'Nenhuma indicação pendente encontrada'
		},
		'Sendo Atendido': {
			badgeColor: 'bg-blue-600 hover:bg-blue-600',
			badgeWidth: 'w-24',
			label: 'Atendimento',
			emptyMessage: 'Nenhuma indicação em atendimento encontrada'
		},
		Finalizado: {
			badgeColor: 'bg-green-600 hover:bg-green-600',
			badgeWidth: 'w-20',
			label: 'Finalizado',
			emptyMessage: 'Nenhuma indicação finalizada encontrada'
		},
		'Sem Sucesso': {
			badgeColor: 'bg-gray-500 hover:bg-gray-500',
			badgeWidth: 'w-20',
			label: 'Cancelado',
			emptyMessage: 'Nenhuma indicação cancelada encontrada'
		}
	};

	// Configuração da paginação
	let currentPage = 1;
	let itemsPerPage = 8;

	$: filteredLeads = leads?.filter((lead) => lead.status === status) || [];

	// Calcula o número total de páginas
	$: totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

	// Obtém os leads da página atual
	$: paginatedLeads = filteredLeads.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	// Funções para navegação
	function nextPage() {
		if (currentPage < totalPages) currentPage++;
	}

	function previousPage() {
		if (currentPage > 1) currentPage--;
	}

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) currentPage = page;
	}

	// Gera array com números das páginas
	$: pages = Array.from({ length: totalPages }, (_, i) => i + 1);
</script>

<div class="flex w-full flex-wrap justify-center gap-10 pt-4">
	{#if paginatedLeads.length === 0}
		<div class="flex w-full justify-center p-8 text-lg text-gray-500">
			{statusConfig[status].emptyMessage}
		</div>
	{:else}
		{#each paginatedLeads as lead}
			<div
				class="relative flex h-[6rem] w-[40%] items-center justify-between gap-6 rounded-lg bg-zinc-800 p-4 text-white"
			>
				<Badge
					class="absolute -top-3 right-2 {statusConfig[status].badgeWidth} {statusConfig[status]
						.badgeColor} text-white"
				>
					{statusConfig[status].label}
				</Badge>

				<div class="flex flex-col gap-2 pl-4">
					<h1 class="text-lg font-semibold">{lead.fullName}</h1>
					<h2>Tel: {lead.telefone}</h2>
				</div>

				<Separator orientation="vertical" class="h-14 bg-zinc-600 text-center" />

				<div class="flex flex-col gap-2">
					<h2 class="text-xs">
						Criado em: <span class="font-semibold">
							{lead?.criadoEm ? formatarData(lead.criadoEm) : 'Data não disponível'}
						</span>
					</h2>
					<h2>
						PromoCode: <span class="font-semibold">{lead.promoCode}</span>
					</h2>
				</div>
			</div>
		{/each}
	{/if}
</div>

{#if paginatedLeads.length > 0}
	<div class="fixed bottom-0 left-0 right-0 my-4 flex items-center justify-center gap-2">
		<Button
			variant="ghost"
			class="hover:bg-transparent"
			on:click={previousPage}
			disabled={currentPage === 1}
		>
			<CircleArrowLeftIcon />
		</Button>

		{#each pages as page}
			<Button
				variant={currentPage === page ? 'default' : 'outline'}
				class="h-8 w-8"
				on:click={() => goToPage(page)}
			>
				{page}
			</Button>
		{/each}

		<Button
			variant="ghost"
			class="hover:bg-transparent"
			on:click={nextPage}
			disabled={currentPage === totalPages}
		>
			<CircleArrowRight />
		</Button>
	</div>
{/if}
