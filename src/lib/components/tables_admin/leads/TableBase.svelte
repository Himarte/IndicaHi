<script lang="ts">
	import { Badge } from '../../ui/badge';
	import Separator from '../../ui/separator/separator.svelte';
	import { formatarData, formatarTelefone, formatarCPF, formatarCNPJ } from '$lib/uteis/masks';
	import { CircleArrowLeftIcon, CircleArrowRight } from 'lucide-svelte';
	import Button from '../../ui/button/button.svelte';
	import type { LeadsSchema } from '$lib/server/database/schema';

	export let leads: LeadsSchema[];

	const statusConfig = {
		Pendente: {
			badgeColor: 'bg-red-600 hover:bg-red-600',
			badgeWidth: 'w-24',
			label: 'Pendente',
			emptyMessage: 'Nenhum lead pendente encontrado'
		},
		'Sendo Atendido': {
			badgeColor: 'bg-blue-600 hover:bg-blue-600',
			badgeWidth: 'w-32',
			label: 'Em Atendimento',
			emptyMessage: 'Nenhum lead em atendimento encontrado'
		},
		Finalizado: {
			badgeColor: 'bg-green-600 hover:bg-green-600',
			badgeWidth: 'w-24',
			label: 'Finalizado',
			emptyMessage: 'Nenhum lead finalizado encontrado'
		},
		Pago: {
			badgeColor: 'bg-green-600 hover:bg-green-600',
			badgeWidth: 'w-20',
			label: 'Pago',
			emptyMessage: 'Nenhum lead pago encontrado'
		},
		Cancelado: {
			badgeColor: 'bg-gray-500 hover:bg-gray-500',
			badgeWidth: 'w-24',
			label: 'Cancelado',
			emptyMessage: 'Nenhum lead cancelado encontrado'
		},
		'Aguardando Pagamento': {
			badgeColor: 'bg-yellow-600 hover:bg-yellow-600',
			badgeWidth: 'w-44',
			label: 'Aguardando Pagamento',
			emptyMessage: 'Nenhum lead aguardando pagamento encontrado'
		}
	};

	// Configuração da paginação
	let currentPage = 1;
	let itemsPerPage = 4;

	// Calcula o número total de páginas
	$: totalPages = Math.ceil(leads.length / itemsPerPage);

	// Obtém os leads da página atual
	$: paginatedLeads = leads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
		<div class="flex w-full justify-center p-8 text-gray-500">Nenhum lead encontrado</div>
	{:else}
		{#each paginatedLeads as lead}
			<div
				class="relative flex w-[40%] flex-col items-center justify-between rounded-lg bg-zinc-800 text-white"
			>
				<Badge
					class="absolute -top-3 right-2 flex items-center justify-center  {statusConfig[
						lead.status
					].badgeWidth} {statusConfig[lead.status].badgeColor} text-white"
				>
					{statusConfig[lead.status].label}
				</Badge>

				<h1 class=" p-4 text-xl font-semibold">{lead.fullName}</h1>
				<Separator orientation="horizontal" class="bg-zinc-600 " />

				<div class="flex w-full items-center">
					<div class="flex w-1/3 flex-col">
						<h2 class=" flex flex-col px-2 py-1 font-semibold text-orange-400">
							Telefone: <span class="font-normal text-white"
								>{lead.telefone ? formatarTelefone(lead.telefone) : 'Não informado'}</span
							>
						</h2>

						<h2 class=" flex flex-col px-2 py-1 font-semibold text-orange-400">
							CPF: <span class="font-normal text-white"
								>{lead.cpf ? formatarCPF(lead.cpf) : 'Não informado'}</span
							>
						</h2>

						<h2 class=" flex flex-col px-2 py-1 font-semibold text-orange-400">
							CNPJ: <span class="font-normal text-white"
								>{lead.cnpj ? formatarCNPJ(lead.cnpj) : 'Não informado'}</span
							>
						</h2>
					</div>

					<Separator orientation="vertical" class="bg-zinc-600 text-center" />

					<div class="flex w-1/3 flex-col">
						<h2 class=" flex flex-col px-2 py-1 font-semibold text-orange-400">
							Modelo: <span class="font-normal text-white"
								>{lead.planoModelo || 'Não definido'}</span
							>
						</h2>

						<h2 class=" flex flex-col px-2 py-1 font-semibold text-orange-400">
							Plano: <span class="font-normal text-white"
								>{lead.planoNome} - {lead.planoMegas}MB</span
							>
						</h2>

						<h2 class=" flex flex-col px-2 py-1 font-semibold text-orange-400">
							Código Promocional: <span class="font-normal text-white"
								>{lead.promoCode || 'Não informado'}</span
							>
						</h2>
					</div>

					<div class="flex w-1/3 flex-col">
						<h2 class=" flex flex-col px-2 py-1 font-semibold text-orange-400">
							Criado em: <span class="font-normal text-white">
								{lead.criadoEm ? formatarData(lead.criadoEm) : 'Data não disponível'}
							</span>
						</h2>

						<h2 class=" flex flex-col px-2 py-1 font-semibold text-orange-400">
							Atendido por: <span class="font-normal text-white"
								>{lead.atendidoPor || 'Não atendido'}</span
							>
						</h2>

						<h2 class=" flex flex-col px-2 py-1 font-semibold text-orange-400">
							Pago por: <span class="font-normal text-white">{lead.pagoPor || 'Não pago'}</span>
						</h2>
					</div>
				</div>
			</div>
		{/each}
	{/if}
</div>

{#if paginatedLeads.length > 0}
	<div class=" fixed bottom-0 left-0 right-0 my-4 flex items-center justify-center">
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
