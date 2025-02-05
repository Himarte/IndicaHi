<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { CircleArrowLeftIcon, CircleArrowRight } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Time from '$lib/components/ui/time/index.svelte';
	import BotaoBaixarDashboard from './BotaoBaixarDashboard.svelte';
	import type { LeadsSchema } from '$lib/server/database/schema';

	export let leads: LeadsSchema[];
	export let status: 'Pendente' | 'Sendo Atendido' | 'Aguardando Pagamento' | 'Pago' | 'Cancelado';

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
		'Aguardando Pagamento': {
			badgeColor: 'bg-yellow-600 hover:bg-yellow-600',
			badgeWidth: 'w-44',
			label: 'Aguardando Pagamento',
			emptyMessage: 'Nenhuma indicação aguardando pagamento encontrada'
		},
		Pago: {
			badgeColor: 'bg-green-600 hover:bg-green-600',
			badgeWidth: 'w-20',
			label: 'Pago',
			emptyMessage: 'Nenhuma indicação paga encontrada'
		},
		Cancelado: {
			badgeColor: 'bg-gray-500 hover:bg-gray-500',
			badgeWidth: 'w-20',
			label: 'Cancelado',
			emptyMessage: 'Nenhuma indicação cancelada encontrada'
		}
	};

	// Configuração da paginação
	let currentPage = 1;
	let itemsPerPage = 4;

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
				class=" relative flex w-[40%] flex-col items-center justify-between rounded-lg bg-zinc-800 text-white"
			>
				<Badge
					class="absolute -top-3 right-2 flex items-center justify-center {statusConfig[status]
						.badgeWidth} {statusConfig[status].badgeColor} text-white"
				>
					{statusConfig[status].label}
				</Badge>

				<h1 class="py-2 text-xl font-semibold">{lead.fullName}</h1>
				<Separator orientation="horizontal" class=" bg-zinc-600 text-center" />

				<div class="flex w-full items-center justify-between">
					<div class="flex w-1/2 flex-col items-start gap-2 p-4">
						{#if status != 'Pendente'}
							<h2>
								<span class="font-bold text-orange-400">Atendido por:</span>
								{lead.atendidoPor}
							</h2>
						{/if}
						<h2>
							<span class="flex font-bold text-orange-400">Plano de interesse:</span>
							{lead.planoNome} - {lead.planoMegas} MB
						</h2>
					</div>

					<Separator orientation="vertical" class="bg-zinc-600 text-center" />

					<div class="flex w-1/2 flex-col items-start gap-2 p-4">
						<h2>
							<span class="font-bold text-orange-400">Tipo de plano:</span>
							{lead.planoModelo}
						</h2>
						<h2>
							<span class="font-bold text-orange-400">Código de Promoção:</span>
							{lead.promoCode}
						</h2>
					</div>
				</div>
				<Separator orientation="horizontal" class=" bg-zinc-600 text-center" />
				<div class="flex w-full justify-between">
					<h2 class="w-1/2 py-2 text-center">
						<span class="font-bold text-orange-400"> Criado em: </span>
						{#if lead?.criadoEm}
							<Time timestamp={lead.criadoEm} format="DD/MM/YYYY" />
						{:else}
							<span>Data não disponível</span>
						{/if}
					</h2>
					<Separator orientation="vertical" class=" bg-zinc-600 text-center" />
					<h2 class="w-1/2 py-2 text-center">
						<span class="font-bold text-orange-400">
							{status === 'Sendo Atendido'
								? 'Atendido:'
								: status === 'Pago'
									? 'Pagamento realizado:'
									: status === 'Cancelado'
										? 'Cancelado:'
										: status === 'Aguardando Pagamento'
											? 'Aguardando desde:'
											: 'Aguardando:'}
						</span>
						{#if status === 'Sendo Atendido'}
							{#if lead?.atendidoEm}
								<Time relative timestamp={lead.atendidoEm} live />
							{:else}
								<span>Data não disponível</span>
							{/if}
						{:else if status === 'Pago'}
							{#if lead?.pagoEm}
								<Time relative timestamp={lead.pagoEm} live />
							{:else}
								<span>Data não disponível</span>
							{/if}
						{:else if status === 'Cancelado'}
							{#if lead?.canceladoEm}
								<Time relative timestamp={lead.canceladoEm} live />
							{:else}
								<span>Data não disponível</span>
							{/if}
						{:else if status === 'Aguardando Pagamento'}
							{#if lead?.aguardandoPagamentoEm}
								<Time relative timestamp={lead.aguardandoPagamentoEm} live />
							{:else}
								<span>Data não disponível</span>
							{/if}
						{:else if lead?.criadoEm}
							<Time relative timestamp={lead.criadoEm} live />
						{:else}
							<span>Data não disponível</span>
						{/if}
					</h2>
				</div>

				{#if status === 'Pago'}
					<BotaoBaixarDashboard {lead} />
				{/if}
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
