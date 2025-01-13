<script lang="ts">
	import { Badge } from '../ui/badge';
	import Separator from '../ui/separator/separator.svelte';
	import type { LeadsSchema } from '$lib/server/database/schema';
	import { formatarData } from '$lib/uteis/masks';
	import { CircleArrowLeftIcon, CircleArrowRight, DownloadIcon } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';
	import { toast } from 'svelte-sonner';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	export let leads: LeadsSchema[];
	export let status: 'Pendente' | 'Sendo Atendido' | 'Pago' | 'Cancelado';

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
		Pago: {
			badgeColor: 'bg-green-600 hover:bg-green-600',
			badgeWidth: 'w-20',
			label: 'Finalizado',
			emptyMessage: 'Nenhuma indicação finalizada encontrada'
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

	function handleDownloadComprovante(comprovantePagamento: string | null) {
		if (!comprovantePagamento) {
			toast.error('Comprovante não disponível');
			return;
		}

		try {
			// Extrai o tipo do arquivo e os dados do base64
			const [, tipo, base64] = comprovantePagamento.match(/data:(.*);base64,(.*)/) || [];

			if (!tipo || !base64) {
				toast.error('Formato do comprovante inválido');
				return;
			}

			// Converte o base64 para Blob
			const byteCharacters = atob(base64);
			const byteNumbers = new Array(byteCharacters.length);

			for (let i = 0; i < byteCharacters.length; i++) {
				byteNumbers[i] = byteCharacters.charCodeAt(i);
			}

			const byteArray = new Uint8Array(byteNumbers);
			const blob = new Blob([byteArray], { type: tipo });

			// Cria URL do blob e link para download
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `comprovante_${leads[0].fullName.replace(/\s+/g, '_')}.${tipo.split('/')[1]}`;

			// Simula o clique no link
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			// Libera a URL
			window.URL.revokeObjectURL(url);

			toast.success('Download iniciado com sucesso!');
		} catch (error) {
			console.error('Erro ao baixar comprovante:', error);
			toast.error('Erro ao baixar o comprovante');
		}
	}
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
					class="absolute -top-3 right-2 {statusConfig[status].badgeWidth} {statusConfig[status]
						.badgeColor} text-white"
				>
					{statusConfig[status].label}
				</Badge>

				<h1 class="py-2 text-xl font-semibold">{lead.fullName}</h1>
				<Separator orientation="horizontal" class=" bg-zinc-600 text-center" />

				<div class="flex w-full justify-between">
					<div class="flex w-1/2 flex-col gap-2 p-4">
						<h2>
							<span class="font-bold text-orange-400">
								{status === 'Sendo Atendido'
									? 'Atendido em:'
									: status === 'Pago'
										? 'Finalizado em:'
										: status === 'Cancelado'
											? 'Cancelado em:'
											: 'Criado em:'}
							</span>
							{status === 'Sendo Atendido'
								? lead?.atendidoEm
									? formatarData(lead.atendidoEm)
									: 'Data não disponível'
								: status === 'Pago'
									? lead?.pagoEm
										? formatarData(lead.pagoEm)
										: 'Data não disponível'
									: status === 'Cancelado'
										? lead?.canceladoEm
											? formatarData(lead.canceladoEm)
											: 'Data não disponível'
										: lead?.criadoEm
											? formatarData(lead.criadoEm)
											: 'Data não disponível'}
						</h2>
						<h2>
							<span class="font-bold text-orange-400">Código Promocional:</span>
							{lead.promoCode}
						</h2>
					</div>

					<Separator orientation="vertical" class="bg-zinc-600 text-center" />

					<div class="flex w-1/2 flex-col items-start gap-2 p-4">
						<h2>
							<span class="font-bold text-orange-400">Plano:</span>
							{lead.planoNome} - {lead.planoMegas} MB
						</h2>
						<h2>
							<span class="font-bold text-orange-400">Tipo de plano:</span>
							{lead.planoModelo}
						</h2>
						{#if status === 'Pago'}
							<Tooltip.Root>
								<Tooltip.Trigger asChild let:builder>
									<Button
										builders={[builder]}
										variant="ghost"
										class="absolute bottom-2 right-2 flex items-center text-orange-400"
										on:click={() => handleDownloadComprovante(lead.comprovantePagamento ?? null)}
									>
										<DownloadIcon />
									</Button>
								</Tooltip.Trigger>
								<Tooltip.Content side="bottom">
									<p>Baixar Comprovante</p>
								</Tooltip.Content>
							</Tooltip.Root>
						{/if}
					</div>
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
