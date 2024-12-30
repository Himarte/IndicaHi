<script lang="ts">
	import { Badge } from '../ui/badge';
	import Separator from '../ui/separator/separator.svelte';
	import type { LeadsSchema } from '$lib/server/database/schema';
	import { formatarData } from '$lib/uteis/masks';
	import { CircleArrowLeftIcon, CircleArrowRight } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';
	import Dropdown from '$lib/components/Dropdown-dashboard.svelte';
	import { Circle3 } from 'svelte-loading-spinners';

	export let leads: LeadsSchema[];

	// Configuração da paginação
	let currentPage = 1;
	let itemsPerPage = 8;
	$: leadsPagos = leads?.filter((lead) => lead.status === 'Pago') || [];

	// Calcula o número total de páginas
	$: totalPages = Math.ceil(leadsPagos.length / itemsPerPage);

	// Obtém os leads da página atual
	$: paginatedLeads = leadsPagos.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	// Funções para navegação
	function nextPage() {
		if (currentPage < totalPages) {
			currentPage++;
		}
	}

	function previousPage() {
		if (currentPage > 1) {
			currentPage--;
		}
	}

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
		}
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
				Nenhum lead pago encontrado
			</div>
		{:else}
			{#each paginatedLeads as lead}
				<div
					class="relative flex h-[6rem] w-[40%] items-center justify-between gap-6 rounded-lg bg-zinc-800 p-4 text-white"
				>
					<Badge class="absolute -top-3 right-2 w-20 bg-green-600 text-white hover:bg-green-600">
						Pago
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
					<Dropdown {lead} />
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
