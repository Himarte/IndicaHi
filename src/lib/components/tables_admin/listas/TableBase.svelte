<script lang="ts">
	import { Badge } from '../../ui/badge';
	import Separator from '../../ui/separator/separator.svelte';
	import { formatarData } from '$lib/uteis/masks';
	import { CircleArrowLeftIcon, CircleArrowRight } from 'lucide-svelte';
	import Button from '../../ui/button/button.svelte';
	import type { UserSchema } from '$lib/server/database/schema';

	export let usuarios: UserSchema[];
	export let tipo: 'vendedor-interno' | 'vendedor-externo' | 'administrador' | 'financeiro';

	const tipoConfig = {
		'vendedor-interno': {
			badgeColor: 'bg-blue-600 hover:bg-blue-600',
			badgeWidth: 'w-32',
			label: 'Vendedor Interno',
			emptyMessage: 'Nenhum vendedor interno encontrado'
		},
		'vendedor-externo': {
			badgeColor: 'bg-green-600 hover:bg-green-600',
			badgeWidth: 'w-32',
			label: 'Vendedor Externo',
			emptyMessage: 'Nenhum vendedor externo encontrado'
		},
		administrador: {
			badgeColor: 'bg-red-600 hover:bg-red-600',
			badgeWidth: 'w-28',
			label: 'Administrador',
			emptyMessage: 'Nenhum administrador encontrado'
		},
		financeiro: {
			badgeColor: 'bg-yellow-600 hover:bg-yellow-600',
			badgeWidth: 'w-24',
			label: 'Financeiro',
			emptyMessage: 'Nenhum usuário financeiro encontrado'
		}
	};

	// Configuração da paginação
	let currentPage = 1;
	let itemsPerPage = 8;

	// Calcula o número total de páginas
	$: totalPages = Math.ceil(usuarios.length / itemsPerPage);

	// Obtém os usuários da página atual
	$: paginatedUsers = usuarios.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
	{#if paginatedUsers.length === 0}
		<div class="flex w-full justify-center p-8 text-lg text-gray-500">
			{tipoConfig[tipo].emptyMessage}
		</div>
	{:else}
		{#each paginatedUsers as usuario}
			<div
				class="relative flex h-[6rem] w-[40%] items-center justify-between gap-6 rounded-lg bg-zinc-800 p-4 text-white"
			>
				<Badge
					class="{tipoConfig[tipo].badgeWidth} {tipoConfig[tipo]
						.badgeColor} absolute -top-3 right-2 text-white"
				>
					{tipoConfig[tipo].label}
				</Badge>

				<div class="flex flex-col gap-2 pl-4">
					<h1 class="text-lg font-semibold">{usuario.name}</h1>
					<h2>Email: {usuario.email}</h2>
				</div>

				<Separator orientation="vertical" class="h-14 bg-zinc-600 text-center" />

				<div class="flex flex-col gap-2">
					<h2 class="text-xs">
						Criado em: <span class="font-semibold">
							{usuario?.criadoEm ? formatarData(usuario.criadoEm) : 'Data não disponível'}
						</span>
					</h2>
					<h2>
						Cargo: <span class="font-semibold">{usuario.job}</span>
					</h2>
				</div>
			</div>
		{/each}
	{/if}
</div>

{#if paginatedUsers.length > 0}
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
