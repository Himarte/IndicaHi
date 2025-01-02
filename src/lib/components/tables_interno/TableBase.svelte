<script lang="ts">
	import { Badge } from '../ui/badge';
	import Separator from '../ui/separator/separator.svelte';
	import type { LeadsSchema } from '$lib/server/database/schema';
	import { formatarData } from '$lib/uteis/masks';
	import { CircleArrowLeftIcon, CircleArrowRight } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';
	import Dropdown from '$lib/components/StatusDropdown/Dropdown-dashboard.svelte';
	import { Circle3 } from 'svelte-loading-spinners';

	export let leads: LeadsSchema[];
	export let cargo: string;
	export let status: 'Pendente' | 'Sendo Atendido' | 'Finalizado' | 'Cancelado';

	// Configuração visual por status
	const statusConfig = {
		Pendente: {
			badgeColor: 'bg-red-600 hover:bg-red-600',
			badgeWidth: 'w-20',
			label: 'Pendente',
			emptyMessage: 'Nenhum lead pendente encontrado'
		},
		'Sendo Atendido': {
			badgeColor: 'bg-blue-600 hover:bg-blue-600',
			badgeWidth: 'w-24',
			label: 'Atendimento',
			emptyMessage: 'Nenhum lead em atendimento encontrado'
		},
		Finalizado: {
			badgeColor: 'bg-green-600 hover:bg-green-600',
			badgeWidth: 'w-20',
			label: 'Finalizado',
			emptyMessage: 'Nenhum lead finalizado encontrado'
		},
		Cancelado: {
			badgeColor: 'bg-gray-500 hover:bg-gray-500',
			badgeWidth: 'w-20',
			label: 'Cancelado',
			emptyMessage: 'Nenhum lead cancelado encontrado'
		}
	};

	// Configuração da paginação
	let currentPage = 1;
	let itemsPerPage = 6;

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

{#await leads}
	<div class="flex h-[80vh] w-full items-center justify-center">
		<Circle3
			size="70"
			ballBottomLeft="#F97316"
			ballBottomRight="#FAFAFA"
			ballTopLeft="#FAFAFA"
			ballTopRight="#F97316"
		/>
	</div>
{:then}
	<div class="flex w-full flex-wrap justify-center gap-10 pt-4">
		{#if paginatedLeads.length === 0}
			<div class="flex w-full justify-center p-8 text-lg text-gray-500">
				{statusConfig[status].emptyMessage}
			</div>
		{:else}
			{#each paginatedLeads as lead}
				<div
					class="relative flex h-[12rem] w-[40%] flex-col items-start justify-center rounded-lg bg-zinc-800 px-4 text-white"
				>
					<Badge
						class="absolute -top-3 right-2 {statusConfig[status].badgeWidth} {statusConfig[status]
							.badgeColor} text-white"
					>
						{statusConfig[status].label}
					</Badge>

					<h1 class="pb-4 text-xl font-semibold">{lead.fullName}</h1>

					<div class="flex w-full justify-between pb-2">
						<div class="flex w-1/3 flex-col gap-2">
							<div>
								<h2 class="text-sm font-bold">Telefone:</h2>
								<h2 class="text-sm">{lead.telefone}</h2>
							</div>
							<div>
								<h2 class="text-sm font-bold">CPF:</h2>
								<h2 class="text-sm">{lead.cpf ? lead.cpf : 'Não cadastrado'}</h2>
							</div>
							<div>
								<h2 class="text-sm font-bold">CNPJ:</h2>
								<h2 class="text-sm">{lead.cnpj ? lead.cnpj : 'Não cadastrado'}</h2>
							</div>
						</div>

						<Separator orientation="vertical" class=" bg-zinc-600 text-center" />

						<div class="flex w-1/3 flex-col gap-2 pl-2">
							<div class="flex flex-col text-sm">
								<span class="font-bold">Criado em:</span>
								{lead?.criadoEm ? formatarData(lead.criadoEm) : 'Data não disponível'}
							</div>
							<div class="flex flex-col text-sm">
								<span class="font-bold">Código Promocional:</span>
								{lead.promoCode ? lead.promoCode : 'Não cadastrado'}
							</div>
							<div class="flex flex-col text-sm">
								<span class="text-sm font-bold">Plano:</span>
								{lead.planoNome}
							</div>
						</div>
						<div class="flex items-center justify-center">
							<Dropdown {lead} {cargo} />
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>

	{#if paginatedLeads.length > 0}
		<div class="flex w-full items-center justify-center gap-2 py-4">
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
{:catch error}
	<div class="flex w-full justify-center p-8 text-lg text-red-500">
		Erro ao carregar leads: {error.message}
	</div>
{/await}
