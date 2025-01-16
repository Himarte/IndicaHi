<script lang="ts">
	import { Badge } from '../ui/badge';
	import Separator from '../ui/separator/separator.svelte';
	import { formatarCPF, formatarTelefone, formatarCNPJ } from '$lib/uteis/masks';
	import { CircleArrowLeftIcon, CircleArrowRight } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';
	import { Circle3 } from 'svelte-loading-spinners';
	import SheetFinanceiro from '$lib/components/Sheets/SheetFinanceiro.svelte';
	import type { LeadFinanceiro } from '$lib/types/financeiro';
	import Time from '$lib/components/ui/time/index.svelte';

	interface LeadsFinanceiro {
		success: boolean;
		data: LeadFinanceiro[];
	}

	export let leads: LeadsFinanceiro;
	export let cargo: string;
	export let status: 'Aguardando Pagamento' | 'Pago';

	// Configuração visual por status
	const statusConfig = {
		'Aguardando Pagamento': {
			badgeColor: 'bg-yellow-600 hover:bg-yellow-600',
			badgeWidth: 'w-38',
			label: 'Aguardando Pagamento',
			emptyMessage: 'Nenhum lead aguardando pagamento encontrado'
		},
		Pago: {
			badgeColor: 'bg-green-600 hover:bg-green-600',
			badgeWidth: 'w-20',
			label: 'Pago',
			emptyMessage: 'Nenhum lead pago encontrado'
		}
	};

	// Configuração da paginação
	let currentPage = 1;
	let itemsPerPage = 4;

	$: filteredLeads = leads?.success ? leads.data.filter((lead) => lead.status === status) : [];

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
					class="relative flex w-[40%] flex-col items-center justify-center rounded-lg bg-zinc-800 text-white"
				>
					<Badge
						class="absolute -top-3 right-2 flex items-center justify-center {statusConfig[status]
							.badgeWidth} {statusConfig[status].badgeColor} text-white"
					>
						{statusConfig[status].label}
					</Badge>

					<h1 class="py-2 text-xl font-semibold">{lead.fullName}</h1>
					<Separator orientation="horizontal" class=" bg-zinc-600 text-center" />

					<div class="flex w-full justify-between">
						<div class="flex w-1/3 flex-col gap-2 p-3">
							<div class="flex flex-col text-sm">
								<span class="font-bold text-orange-400">Vendedor:</span>
								{lead.vendedor?.nome}
							</div>
							<div>
								<h2 class="select-none text-sm font-bold text-orange-400">Contato do vendedor:</h2>
								<h2 class="text-sm">
									{formatarTelefone(lead.vendedor?.telefone ?? 'Sem telefone')}
								</h2>
							</div>

							<div>
								<h2 class="select-none text-sm font-bold text-orange-400">
									{lead.cpf ? 'CPF:' : lead.cnpj ? 'CNPJ:' : 'CPF/CNPJ:'}
								</h2>
								<h2 class="text-sm">
									{#if lead.cpf}
										{formatarCPF(lead.cpf)}
									{:else if lead.cnpj}
										{formatarCNPJ(lead.cnpj)}
									{:else}
										Não cadastrado
									{/if}
								</h2>
							</div>
						</div>

						<Separator orientation="vertical" class="bg-zinc-600 text-center" />

						<div class="flex w-1/3 flex-col items-start justify-center gap-2 p-3">
							{#if lead.vendedor}
								<div class="flex flex-col text-sm">
									<span class="font-bold text-orange-400">Código Promocional:</span>
									{lead.promoCode}
								</div>
								<div class="flex flex-col text-sm">
									<span class="font-bold text-orange-400">Chave PIX ({lead.vendedor.pixType}):</span
									>
									{lead.vendedor?.pixType === 'cpf'
										? formatarCPF(lead.vendedor?.pixCode ?? '')
										: lead.vendedor?.pixType === 'cnpj'
											? formatarCNPJ(lead.vendedor?.pixCode ?? '')
											: lead.vendedor?.pixType === 'telefone'
												? formatarTelefone(lead.vendedor?.pixCode ?? '')
												: (lead.vendedor?.pixCode ?? '')}
								</div>
							{:else}
								<div class="flex flex-col text-sm">
									<span class="text-yellow-500">Vendedor não encontrado</span>
								</div>
							{/if}
						</div>

						<div class="flex w-1/3 items-center justify-center pr-2">
							<SheetFinanceiro {lead} {cargo} />
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
								{status === 'Aguardando Pagamento'
									? 'Atendido:'
									: status === 'Pago'
										? 'Pagamento realizado:'
										: 'Aguardando:'}
							</span>
							{#if status === 'Aguardando Pagamento'}
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
{:catch error}
	<div class="flex w-full justify-center p-8 text-lg text-red-500">
		Erro ao carregar leads: {error.message}
	</div>
{/await}
