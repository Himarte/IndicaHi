<script lang="ts">
	import { Badge } from '../ui/badge';
	import Separator from '../ui/separator/separator.svelte';
	import type { LeadsSchema } from '$lib/server/database/schema';
	import { formatarCPF, formatarTelefone, formatarCNPJ } from '$lib/uteis/masks';
	import { CircleArrowLeftIcon, CircleArrowRight } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';
	import Dropdown from '$lib/components/StatusDropdown/Dropdown-dashboard.svelte';
	import { Circle3 } from 'svelte-loading-spinners';
	import Time from '$lib/components/ui/time/index.svelte';
	export let leads: LeadsSchema[];
	export let cargo: string;
	export let status: 'Pendente' | 'Sendo Atendido' | 'Finalizado' | 'Cancelado';

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
	<div class="flex h-full items-start justify-center">
		<div class="flex w-full flex-wrap justify-center gap-12 pt-4">
			{#if paginatedLeads.length === 0}
				<div class="flex w-full justify-center p-8 text-lg text-gray-500">
					{statusConfig[status].emptyMessage}
				</div>
			{:else}
				{#each paginatedLeads as lead}
					<div
						class="relative flex w-[40%] flex-col items-center justify-center rounded-lg bg-zinc-800 text-white"
					>
						<Badge
							class="absolute -top-3 right-2 {statusConfig[status].badgeWidth} {statusConfig[status]
								.badgeColor} text-white"
						>
							{statusConfig[status].label}
						</Badge>

						<h1 class="py-2 text-xl font-semibold">{lead.fullName}</h1>
						<Separator orientation="horizontal" class=" bg-zinc-600 text-center" />

						<div class="flex w-full justify-between">
							<div class="flex w-1/3 flex-col gap-2 p-3">
								<div>
									<h2 class="text-sm font-bold text-orange-400">Telefone:</h2>
									<h2 class="text-sm">
										{lead.telefone ? formatarTelefone(lead.telefone) : 'Não cadastrado'}
									</h2>
								</div>

								<div>
									<h2 class="text-sm font-bold text-orange-400">CPF:</h2>
									<h2 class="text-sm">
										{lead.cpf ? formatarCPF(lead.cpf) : 'Não cadastrado'}
									</h2>
								</div>
								<div>
									<h2 class="text-sm font-bold text-orange-400">CNPJ:</h2>
									<h2 class="text-sm">
										{lead.cnpj ? formatarCNPJ(lead.cnpj) : 'Não cadastrado'}
									</h2>
								</div>
							</div>
							<Separator orientation="vertical" class=" bg-zinc-600 text-center" />
							<div class="flex w-2/3 gap-2 p-3">
								<div class="flex w-1/2 flex-col gap-2">
									<div>
										{#if status !== 'Pendente'}
											<div class="flex flex-col text-sm">
												<span class="text-sm font-bold text-orange-400">Atendido por:</span>
												{lead.atendidoPor}
											</div>
										{:else}
											<div class="flex flex-col text-sm">
												<span class="text-sm font-bold text-orange-400">Tipo de Plano:</span>
												{lead.planoModelo}
											</div>
										{/if}
									</div>
									<div class="flex flex-col text-sm">
										<span class="text-sm font-bold text-orange-400">Plano:</span>
										{lead.planoNome} - {lead.planoMegas} MB
									</div>
									<div class="flex flex-col text-sm">
										<span class="font-bold text-orange-400">Código Promocional:</span>
										{lead.promoCode ? lead.promoCode : 'Sem código'}
									</div>
								</div>
								<div class="flex w-1/2 items-center justify-center">
									<Dropdown {lead} {cargo} />
								</div>
							</div>
						</div>
						<Separator orientation="horizontal" class=" bg-zinc-600 text-center" />
						<div class="flex w-full justify-between">
							<h2 class="w-1/3 py-2 text-center text-sm">
								<span class="font-bold text-orange-400"> Criado em: </span>
								{#if lead?.criadoEm}
									<Time timestamp={lead.criadoEm} format="DD/MM/YYYY" />
								{:else}
									<span>Data não disponível</span>
								{/if}
							</h2>
							<Separator orientation="vertical" class=" bg-zinc-600 text-center" />
							<h2 class="w-2/3 py-2 text-center text-sm">
								<span class="font-bold text-orange-400">
									{status === 'Sendo Atendido'
										? 'Atendido:'
										: status === 'Finalizado'
											? 'Finalizado:'
											: status === 'Cancelado'
												? 'Cancelado:'
												: 'Aguardando:'}
								</span>
								{#if status === 'Sendo Atendido'}
									{#if lead?.atendidoEm}
										<Time relative timestamp={lead.atendidoEm} live />
									{:else}
										<span>Data não disponível</span>
									{/if}
								{:else if status === 'Finalizado'}
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
								{:else if lead?.criadoEm}
									<Time relative timestamp={lead.criadoEm} live />
								{:else}
									<span>Data não disponível</span>
								{/if}
							</h2>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>
	{#if paginatedLeads.length > 0}
		<div class="my-4 flex items-center justify-center gap-2 pt-5">
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
