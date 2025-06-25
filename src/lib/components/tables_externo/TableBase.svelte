<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import {
		FlameKindlingIcon,
		UserIcon,
		PhoneIcon,
		CreditCardIcon,
		CalendarIcon,
		ClockIcon
	} from '@lucide/svelte';
	import { CircleArrowLeftIcon, CircleArrowRight } from '@lucide/svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Time from '$lib/components/ui/time/index.svelte';
	import BotaoBaixarDashboard from './BotaoBaixarDashboard.svelte';
	import PopoverCancelado from '$lib/components/PopoverCancelado.svelte';
	import { formatarTelefone } from '$lib/uteis/masks';
	import { Circle3 } from 'svelte-loading-spinners';
	import type { LeadsSchema } from '$lib/server/database/schema';

	export let leads: LeadsSchema[];
	export let status: 'Pendente' | 'Sendo Atendido' | 'Aguardando Pagamento' | 'Pago' | 'Cancelado';

	// Enhanced status configuration with better dark theme colors for external dashboard
	const statusConfig = {
		Pendente: {
			label: 'Pendente',
			badgeColor: 'bg-amber-600 hover:bg-amber-700 border-amber-500/50',
			borderColor: 'border-amber-500/30',
			bgColor: 'bg-amber-950/30',
			textColor: 'text-amber-400',
			ringColor: 'ring-amber-400/30',
			iconColor: 'text-amber-400',
			hoverBorderColor: 'hover:border-amber-400/40',
			hoverShadowColor: 'hover:shadow-amber-500/10',
			emptyMessage: 'Nenhuma indicação pendente encontrada'
		},
		'Sendo Atendido': {
			label: 'Em Atendimento',
			badgeColor: 'bg-blue-600 hover:bg-blue-700 border-blue-500/50',
			borderColor: 'border-blue-500/30',
			bgColor: 'bg-blue-950/30',
			textColor: 'text-blue-400',
			ringColor: 'ring-blue-400/30',
			iconColor: 'text-blue-400',
			hoverBorderColor: 'hover:border-blue-400/40',
			hoverShadowColor: 'hover:shadow-blue-500/10',
			emptyMessage: 'Nenhuma indicação em atendimento encontrada'
		},
		'Aguardando Pagamento': {
			label: 'Aguardando Pagamento',
			badgeColor: 'bg-yellow-600 hover:bg-yellow-700 border-yellow-500/50',
			borderColor: 'border-yellow-500/30',
			bgColor: 'bg-yellow-950/30',
			textColor: 'text-yellow-400',
			ringColor: 'ring-yellow-400/30',
			iconColor: 'text-yellow-400',
			hoverBorderColor: 'hover:border-yellow-400/40',
			hoverShadowColor: 'hover:shadow-yellow-500/10',
			emptyMessage: 'Nenhuma indicação aguardando pagamento encontrada'
		},
		Pago: {
			label: 'Finalizado',
			badgeColor: 'bg-emerald-600 hover:bg-emerald-700 border-emerald-500/50',
			borderColor: 'border-emerald-500/30',
			bgColor: 'bg-emerald-950/30',
			textColor: 'text-emerald-400',
			ringColor: 'ring-emerald-400/30',
			iconColor: 'text-emerald-400',
			hoverBorderColor: 'hover:border-emerald-400/40',
			hoverShadowColor: 'hover:shadow-emerald-500/10',
			emptyMessage: 'Nenhuma indicação paga encontrada'
		},
		Cancelado: {
			label: 'Cancelado',
			badgeColor: 'bg-red-600 hover:bg-red-700 border-red-500/50',
			borderColor: 'border-red-500/30',
			bgColor: 'bg-red-950/30',
			textColor: 'text-red-400',
			ringColor: 'ring-red-400/30',
			iconColor: 'text-red-400',
			hoverBorderColor: 'hover:border-red-400/40',
			hoverShadowColor: 'hover:shadow-red-500/10',
			emptyMessage: 'Nenhuma indicação cancelada encontrada'
		}
	};

	// Configuração da paginação - responsiva
	let currentPage = 1;
	let itemsPerPage = 3;

	$: filteredLeads = leads?.filter((lead) => lead.status === status) || [];

	// Ordena leads pelos mais novos primeiro
	$: sortedLeads = filteredLeads.sort((a, b) => {
		const dateA = new Date(a.criadoEm || '').getTime();
		const dateB = new Date(b.criadoEm || '').getTime();
		return dateB - dateA;
	});

	$: totalPages = Math.ceil(sortedLeads.length / itemsPerPage);

	$: paginatedLeads = sortedLeads.slice(
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
		<div class="flex flex-col items-center gap-4">
			<Circle3
				size="70"
				ballBottomLeft="#F97316"
				ballBottomRight="#374151"
				ballTopLeft="#374151"
				ballTopRight="#F97316"
			/>
			<p class="font-medium text-orange-400">Carregando Indicações...</p>
		</div>
	</div>
{:then}
	<div class="bg-background h-full w-full">
		<div class="mx-auto flex h-full w-full flex-col justify-between gap-6">
			{#if paginatedLeads.length === 0}
				<div class="flex h-[60vh] flex-col items-center justify-center gap-6">
					<div
						class="mb-4 flex h-24 w-24 items-center justify-center rounded-full border-2 border-zinc-700/50 bg-zinc-800/50 backdrop-blur-sm"
					>
						<FlameKindlingIcon class="size-12 text-orange-400" />
					</div>
					<div class="text-center">
						<p class="mb-2 text-xl font-semibold text-zinc-200">Nenhuma indicação encontrada</p>
						<p class="text-zinc-400">{statusConfig[status].emptyMessage}</p>
					</div>
				</div>
			{:else}
				<!-- Cards Layout - Responsivo -->
				<div class="flex h-fit w-full flex-wrap justify-center gap-6 p-4 md:p-6">
					{#each paginatedLeads as lead}
						<article
							class="group bg-background relative w-full max-w-[400px] min-w-[280px] rounded-2xl border border-zinc-700/50 backdrop-blur-sm transition-all duration-300 sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1.125rem)] {statusConfig[
								status
							].hoverBorderColor} hover:shadow-2xl {statusConfig[status].hoverShadowColor}"
						>
							<!-- Status Badge -->
							<div class="absolute top-4 right-4 z-10">
								<Badge
									class="{statusConfig[status]
										.badgeColor} px-3 py-1 text-xs font-medium tracking-wide text-white shadow-lg"
								>
									{statusConfig[status].label}
								</Badge>
							</div>

							<!-- Card Content -->
							<div class="p-4 md:p-6">
								<!-- Header -->
								<header class="mb-4 md:mb-6">
									<div class="flex items-center gap-3 md:gap-4">
										<div
											class="flex h-12 w-12 items-center justify-center rounded-full shadow-lg ring-2 md:h-14 md:w-14 {statusConfig[
												status
											].ringColor} {statusConfig[status].bgColor}"
										>
											<UserIcon class="size-6 md:size-7 {statusConfig[status].iconColor} " />
										</div>
										<div class="min-w-0 flex-1">
											<h3
												class="mb-1 truncate text-base leading-tight font-bold text-white md:text-lg"
											>
												{lead.fullName || 'Nome não informado'}
											</h3>
											<div class="flex items-center gap-2 text-xs text-zinc-400 md:text-sm">
												<CalendarIcon class="size-3 flex-shrink-0 md:size-4" />
												<span class="font-medium">Criado em</span>
												{#if lead.criadoEm}
													<Time timestamp={lead.criadoEm} format="DD/MM/YYYY" />
												{:else}
													<span class="text-zinc-500">Data não disponível</span>
												{/if}
											</div>
										</div>
									</div>
								</header>

								<!-- Content Sections -->
								<div class="flex flex-col gap-4 md:gap-5">
									<!-- Contact Information Section -->
									<section class="flex flex-col gap-2">
										<div class="flex items-center gap-3 rounded-xl px-3 py-2">
											<UserIcon class="size-4 {statusConfig[status].iconColor}" />
											<h4
												class="text-xs font-bold md:text-sm {statusConfig[status]
													.textColor} tracking-wide uppercase"
											>
												Informações de Contato
											</h4>
										</div>

										<div class="flex flex-col gap-3">
											<!-- Phone -->
											<div
												class="flex items-center gap-3 rounded-xl border border-zinc-700/30 bg-zinc-900/60 p-3"
											>
												<div
													class="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800/50"
												>
													<PhoneIcon class="size-4 text-zinc-400" />
												</div>
												<div class="min-w-0 flex-1">
													<div
														class="mb-1 text-xs font-medium tracking-wide text-zinc-500 uppercase"
													>
														Telefone
													</div>
													<div class="truncate text-sm font-semibold text-white">
														{lead.telefone ? formatarTelefone(lead.telefone) : 'Não informado'}
													</div>
												</div>
											</div>
										</div>
									</section>

									<!-- Plan & Status Section -->
									<section class="flex flex-col gap-2">
										<div class="flex items-center gap-3 rounded-xl px-3 py-2">
											<CreditCardIcon class="size-4 {statusConfig[status].iconColor}" />
											<h4
												class="text-xs font-bold md:text-sm {statusConfig[status]
													.textColor} tracking-wide uppercase"
											>
												Plano & Status
											</h4>
										</div>

										<div class="flex w-full flex-col gap-2 sm:flex-row">
											<!-- Plan Information -->
											<div
												class="min-w-0 flex-1 rounded-xl border bg-zinc-900/60 px-4 py-2 shadow-sm"
											>
												<div class="mb-1 text-xs font-bold tracking-wide uppercase">
													Plano Contratado
												</div>
												<div class="mb-1 truncate text-sm font-bold text-white">
													{lead.planoNome || 'Plano não especificado'}
												</div>
												<div class="truncate text-xs font-medium text-zinc-400">
													{lead.planoMegas || 0} MB • {lead.planoModelo || 'Tipo não especificado'}
												</div>
											</div>

											<!-- Promotional Code -->
											<div
												class="min-w-0 flex-1 rounded-xl border border-zinc-700/30 bg-zinc-900/60 px-4 py-2"
											>
												<div class="mb-1 text-xs font-bold tracking-wide text-zinc-500 uppercase">
													Código Promocional
												</div>
												<div class="truncate text-sm font-semibold text-white">
													{lead.promoCode || 'Sem código promocional'}
												</div>
											</div>
										</div>

										<!-- Service Status -->
										{#if status !== 'Pendente'}
											<div class="rounded-xl border bg-zinc-900/60 px-4 py-2 text-center">
												<div
													class="mb-1 text-xs font-bold tracking-wide {statusConfig[status]
														.textColor} uppercase"
												>
													Atendimento
												</div>
												<div class="truncate text-sm font-semibold text-white">
													{lead.atendidoPor || 'Não atribuído'}
												</div>
											</div>
										{:else}
											<div
												class="rounded-xl border {statusConfig[status].borderColor} {statusConfig[
													status
												].bgColor} px-4 py-2 text-center shadow-sm"
											>
												<div
													class="mb-1 text-xs font-bold tracking-wide {statusConfig[status]
														.textColor} uppercase"
												>
													Status
												</div>
												<div class="text-sm font-semibold text-white">Aguardando atendimento</div>
											</div>
										{/if}
									</section>
								</div>
							</div>

							<!-- Footer -->
							<footer
								class="flex flex-col items-center gap-3 border-t border-zinc-700/50 bg-zinc-900/30 px-4 pt-4 pb-6 md:px-6 md:pb-8"
							>
								<!-- Timeline Information -->
								<div class="flex items-center gap-2 text-xs text-zinc-400 md:text-sm">
									<ClockIcon class="size-3 flex-shrink-0 md:size-4" />
									<span class="font-medium">
										{status === 'Sendo Atendido'
											? 'Atendido:'
											: status === 'Aguardando Pagamento'
												? 'Aguardando desde:'
												: status === 'Pago'
													? 'Finalizado:'
													: status === 'Cancelado'
														? 'Cancelado:'
														: 'Aguardando:'}
									</span>
									<span class="truncate font-semibold text-zinc-200">
										{#if status === 'Sendo Atendido' && lead.atendidoEm}
											<Time relative timestamp={lead.atendidoEm} live />
										{:else if status === 'Aguardando Pagamento' && lead.aguardandoPagamentoEm}
											<Time relative timestamp={lead.aguardandoPagamentoEm} live />
										{:else if status === 'Pago' && lead.pagoEm}
											<Time relative timestamp={lead.pagoEm} live />
										{:else if status === 'Cancelado' && lead.canceladoEm}
											<Time relative timestamp={lead.canceladoEm} live />
										{:else if lead.criadoEm}
											<Time relative timestamp={lead.criadoEm} live />
										{:else}
											<span class="text-zinc-500">Data não disponível</span>
										{/if}
									</span>
								</div>

								<!-- Action Buttons -->
								<div class="flex w-full items-center justify-center gap-3">
									{#if status === 'Cancelado'}
										<PopoverCancelado leadId={lead.id} />
									{:else if status === 'Pago'}
										<BotaoBaixarDashboard {lead} />
									{/if}
								</div>
							</footer>
						</article>
					{/each}
				</div>
			{/if}

			<!-- Pagination - Responsiva -->
			{#if totalPages > 1}
				<nav class="mb-5 flex items-center justify-center gap-2 px-4" aria-label="Pagination">
					<Button
						variant="ghost"
						size="sm"
						class="border border-zinc-700/50 text-amber-400 hover:border-amber-400/30 hover:bg-zinc-700/50 hover:text-amber-300"
						onclick={previousPage}
						disabled={currentPage === 1}
						aria-label="Previous page"
					>
						<CircleArrowLeftIcon class="size-4" />
					</Button>

					<!-- Desktop: Mostrar todas as páginas -->
					<div class="hidden items-center gap-2 md:flex">
						{#each pages as page}
							<Button
								variant={currentPage === page ? 'default' : 'ghost'}
								size="sm"
								class="h-10 w-10 text-sm font-semibold {currentPage === page
									? 'border-amber-500 bg-amber-500 text-white hover:bg-amber-600'
									: 'border border-zinc-700/50 text-zinc-400 hover:border-amber-400/30 hover:bg-zinc-700/50 hover:text-amber-400'}"
								onclick={() => goToPage(page)}
								aria-label="Go to page {page}"
								aria-current={currentPage === page ? 'page' : undefined}
							>
								{page}
							</Button>
						{/each}
					</div>

					<!-- Mobile: Mostrar apenas páginas próximas -->
					<div class="flex items-center gap-2 md:hidden">
						{#if totalPages <= 5}
							{#each pages as page}
								<Button
									variant={currentPage === page ? 'default' : 'ghost'}
									size="sm"
									class="h-10 w-10 text-sm font-semibold {currentPage === page
										? 'border-amber-500 bg-amber-500 text-white hover:bg-amber-600'
										: 'border border-zinc-700/50 text-zinc-400 hover:border-amber-400/30 hover:bg-zinc-700/50 hover:text-amber-400'}"
									onclick={() => goToPage(page)}
									aria-label="Go to page {page}"
									aria-current={currentPage === page ? 'page' : undefined}
								>
									{page}
								</Button>
							{/each}
						{:else}
							{#each [Math.max(1, currentPage - 1), currentPage, Math.min(totalPages, currentPage + 1)] as page}
								{#if page >= 1 && page <= totalPages}
									<Button
										variant={currentPage === page ? 'default' : 'ghost'}
										size="sm"
										class="h-10 w-10 text-sm font-semibold {currentPage === page
											? 'border-orange-500 bg-orange-500 text-white hover:bg-orange-600'
											: 'border border-zinc-700/50 text-zinc-400 hover:border-orange-400/30 hover:bg-zinc-700/50 hover:text-orange-400'}"
										onclick={() => goToPage(page)}
										aria-label="Go to page {page}"
										aria-current={currentPage === page ? 'page' : undefined}
									>
										{page}
									</Button>
								{/if}
							{/each}
						{/if}
					</div>

					<Button
						variant="ghost"
						size="sm"
						class="border border-zinc-700/50 text-orange-400 hover:border-orange-400/30 hover:bg-zinc-700/50 hover:text-orange-300"
						onclick={nextPage}
						disabled={currentPage === totalPages}
						aria-label="Next page"
					>
						<CircleArrowRight class="size-4" />
					</Button>
				</nav>
			{/if}
		</div>
	</div>
{:catch error}
	<div class="flex min-h-[60vh] items-center justify-center p-6">
		<div class="text-center">
			<div
				class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-red-600/30 bg-red-900/20"
			>
				<svg class="h-8 w-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
					></path>
				</svg>
			</div>
			<p class="text-xl font-medium text-red-400">Erro ao carregar indicações</p>
			<p class="mt-2 text-gray-400">{error.message}</p>
		</div>
	</div>
{/await}
