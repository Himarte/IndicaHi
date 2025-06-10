<script lang="ts">
	import { FlameKindlingIcon } from '@lucide/svelte';

	import { formatarTelefone } from '$lib/uteis/masks';
	import { CircleArrowLeftIcon, CircleArrowRight } from '@lucide/svelte';
	import Button from '../ui/button/button.svelte';
	import { Circle3 } from 'svelte-loading-spinners';
	import SheetFinanceiroGrupo from '$lib/components/Sheets/SheetFinanceiroGrupo.svelte';
	import type { LeadFinanceiro } from '$lib/types/financeiro';
	import Time from '$lib/components/ui/time/index.svelte';
	import { Tooltip } from 'bits-ui';

	interface LeadsFinanceiro {
		success: boolean;
		data: LeadFinanceiro[];
	}

	export let leads: LeadsFinanceiro;
	export let status: 'Aguardando Pagamento' | 'Pago';
	export let cargo: string;

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

	// Função para calcular valor baseado no plano
	function calcularValorPlano(planoMegas: number): number {
		if (planoMegas < 400) return 10;
		if (planoMegas >= 400 && planoMegas <= 600) return 20;
		if (planoMegas >= 700 && planoMegas <= 1000) return 30;
		return 0;
	}

	// Configuração da paginação
	let currentPage = 1;
	let itemsPerPage = 3;

	$: filteredLeads = leads?.success ? leads.data.filter((lead) => lead.status === status) : [];

	// Agrupa leads por código promocional
	$: groupedLeads = filteredLeads.reduce(
		(acc, lead) => {
			const promoCode = lead.promoCode || 'Sem código';
			if (!acc[promoCode]) {
				acc[promoCode] = {
					promoCode,
					vendedor: lead.vendedor,
					clientes: [],
					valorTotal: 0,
					criadoEm: lead.criadoEm,
					atendidoEm: lead.atendidoEm,
					pagoEm: lead.pagoEm,
					bonusIndicacaoResgatado: 0 // Inicializa com 0, será definido após agrupar todos os leads
				};
			}

			acc[promoCode].clientes.push({
				nome: lead.fullName,
				cpf: lead.cpf,
				cnpj: lead.cnpj,
				planoMegas: lead.planoMegas,
				planoNome: lead.planoNome
			});

			acc[promoCode].valorTotal += calcularValorPlano(lead.planoMegas || 0);

			// Define o bonusIndicacaoResgatado do vendedor (vai ser o mesmo para todos os leads do mesmo código)
			if (lead.vendedor?.bonusIndicacaoResgatado) {
				acc[promoCode].bonusIndicacaoResgatado = lead.vendedor.bonusIndicacaoResgatado;
			}

			return acc;
		},
		{} as Record<string, any>
	);

	// Converte o objeto agrupado em array e ordena pelos mais novos primeiro
	$: groupedLeadsArray = Object.values(groupedLeads).sort((a, b) => {
		const dateA = new Date(a.criadoEm).getTime();
		const dateB = new Date(b.criadoEm).getTime();
		return dateB - dateA; // Ordem decrescente (mais novo primeiro)
	});

	// Calcula o número total de páginas baseado nos grupos
	$: totalPages = Math.ceil(groupedLeadsArray.length / itemsPerPage);

	// Obtém os grupos da página atual
	$: paginatedGroups = groupedLeadsArray.slice(
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
			<p class="font-medium text-amber-400">Carregando Leads...</p>
		</div>
	</div>
{:then}
	<div class="flex h-full w-full p-6">
		<div class="mx-auto max-w-7xl">
			{#if paginatedGroups.length === 0}
				<div class="flex h-full flex-col items-center justify-center gap-4">
					<div
						class="mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-gray-700 bg-gray-800"
					>
						<FlameKindlingIcon class="size-12 text-amber-400" />
					</div>
					<p class="text-xl font-medium text-gray-400">{statusConfig[status].emptyMessage}</p>
				</div>
			{:else}
				<!-- Bento Grid -->
				<div
					class="flex h-full w-full flex-col items-center justify-center gap-6 md:flex-row md:items-start"
				>
					{#each paginatedGroups as group, index}
						<div
							class="group relative h-[75%] w-full rounded-2xl border border-gray-700/50 shadow-xl transition-all duration-300 hover:border-amber-500/30 hover:shadow-2xl md:h-[70%]"
						>
							<!-- Status Badge -->
							<div class="absolute -top-2 -right-2 z-10">
								<div
									class="rounded-full border border-amber-400 bg-amber-500 px-2 py-0.5 text-sm font-semibold text-black shadow-lg"
								>
									{statusConfig[status].label}
								</div>
							</div>

							<!-- Card Content -->
							<div class="relative p-6">
								<!-- Header -->
								<div class="mb-6">
									<div class="mb-2 flex items-center gap-3">
										<div
											class="h-3 w-3 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50"
										></div>
										<h2 class="text-xl font-bold text-white">
											{group.promoCode}
										</h2>
									</div>
									<div class="text-sm text-gray-400">
										Criado em <Time timestamp={group.criadoEm} format="DD/MM/YYYY" />
									</div>
								</div>

								<!-- Bento Layout interno -->
								<div class="mb-6 grid grid-cols-2 gap-4">
									<!-- Clientes - Span 2 columns -->
									<div
										class="col-span-2 h-52 rounded-xl border border-gray-700/50 bg-zinc-900/50 p-4"
									>
										<h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-400">
											<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
												<path
													d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"
												></path>
											</svg>
											Clientes ({group.clientes.length})
										</h3>
										<div
											class="scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700 max-h-40 space-y-2 overflow-y-auto"
										>
											{#each group.clientes as cliente}
												<div
													class="rounded-lg border border-gray-600/30 bg-zinc-800/50 p-3 shadow-sm transition-colors hover:bg-zinc-800/50"
												>
													<div class="text-sm font-medium text-gray-100">{cliente.nome}</div>
													<div class="text-xs text-gray-400">
														{cliente.planoNome} • {cliente.planoMegas}MB
													</div>
												</div>
											{/each}
										</div>
									</div>

									<!-- Vendedor -->
									<div class="rounded-xl border border-gray-700/30 bg-zinc-900/40 p-4">
										<h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-400">
											<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
												<path
													fill-rule="evenodd"
													d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
													clip-rule="evenodd"
												></path>
											</svg>
											Vendedor
										</h3>
										{#if group.vendedor}
											<div class="space-y-2">
												<div class="text-sm font-medium text-gray-100">{group.vendedor.nome}</div>
												<div class="text-xs text-gray-400">
													{formatarTelefone(group.vendedor.telefone)}
												</div>
											</div>
										{:else}
											<div class="text-xs font-medium text-amber-400">Vendedor não encontrado</div>
										{/if}
									</div>

									<!-- Valor Total -->
									<div class="rounded-xl border border-green-700/30 bg-green-900/30 p-4">
										<h3 class="mb-2 flex items-center gap-2 text-sm font-semibold text-green-400">
											<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
												<path
													d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"
												></path>
												<path
													fill-rule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
													clip-rule="evenodd"
												></path>
											</svg>
											Total a Pagar
										</h3>
										<div class="space-y-2">
											{#if group.bonusIndicacaoResgatado > 0}
												<div class="h-[3.3rem] space-y-1 text-xs text-gray-300">
													<div class="flex justify-between">
														<span>Planos:</span>
														<span>R$ {group.valorTotal.toFixed(2)}</span>
													</div>
													<div class="flex justify-between text-amber-400">
														<span>Resgatado:</span>
														<span>R$ {group.bonusIndicacaoResgatado}</span>
													</div>
													<div class="mt-1 pt-1">
														<div class="flex justify-between font-semibold">
															<span>Total:</span>
															<span
																>R$ {(group.valorTotal + group.bonusIndicacaoResgatado).toFixed(
																	2
																)}</span
															>
														</div>
													</div>
												</div>
											{:else}
												<div class="flex text-2xl font-bold text-green-400">
													R$ {group.valorTotal.toFixed(2)}
												</div>
											{/if}
										</div>
									</div>
								</div>

								<!-- Footer com status temporal -->
								<div class="flex justify-between border-t border-gray-700/50 py-2">
									<div class="flex items-center text-sm">
										<span class="text-gray-400">
											{status === 'Aguardando Pagamento'
												? 'Atendido'
												: status === 'Pago'
													? 'Pago'
													: 'Aguardando'}:
										</span>
										<span class="ml-2 font-medium text-gray-200">
											{#if status === 'Aguardando Pagamento' && group.atendidoEm}
												<Time relative timestamp={group.atendidoEm} live />
											{:else if status === 'Pago' && group.pagoEm}
												<Time relative timestamp={group.pagoEm} live />
											{:else if group.criadoEm}
												<Time relative timestamp={group.criadoEm} live />
											{:else}
												Data não disponível
											{/if}
										</span>
									</div>
									<!-- Detalhamento (Tooltip) -->
									<Tooltip.Provider>
										<Tooltip.Root>
											<Tooltip.Trigger>
												<Button variant="link" class="text-amber-400">Detalhamento</Button>
											</Tooltip.Trigger>
											<Tooltip.Content
												align="end"
												side="right"
												class="z-50 rounded-lg border border-gray-700 bg-zinc-900 p-3 shadow-2xl"
											>
												<div class="space-y-3">
													<div>
														<h4 class="mb-2 text-xs font-semibold text-green-400">
															Valores por Plano:
														</h4>
														<div class="space-y-1">
															{#each group.clientes as cliente}
																<div class="flex justify-between gap-4 text-xs">
																	<span class="text-gray-200">{cliente.planoMegas}MB</span>
																	<span class="font-medium text-gray-200"
																		>R$ {calcularValorPlano(cliente.planoMegas || 0).toFixed(
																			2
																		)}</span
																	>
																</div>
															{/each}
														</div>
														<div class="mt-2 border-t border-gray-700 pt-1">
															<div class="flex justify-between gap-4 text-xs font-semibold">
																<span class="text-green-400">Subtotal Planos:</span>
																<span class="text-green-400">R$ {group.valorTotal.toFixed(2)}</span>
															</div>
														</div>
													</div>

													{#if group.bonusIndicacaoResgatado > 0}
														<div class="border-t border-gray-700 pt-2">
															<h4 class="mb-1 text-xs font-semibold text-amber-400">
																Bônus de Indicação:
															</h4>
															<div class="flex justify-between gap-4 text-xs">
																<span class="text-amber-300">Resgate de Bônus:</span>
																<span class="font-medium text-amber-300"
																	>R$ {group.bonusIndicacaoResgatado.toFixed(2)}</span
																>
															</div>
														</div>

														<div class="border-t border-gray-700 pt-2">
															<div class="flex justify-between gap-4 text-sm font-bold">
																<span class="text-white">Total Final:</span>
																<span class="text-white"
																	>R$ {(group.valorTotal + group.bonusIndicacaoResgatado).toFixed(
																		2
																	)}</span
																>
															</div>
														</div>
													{/if}
												</div>
											</Tooltip.Content>
										</Tooltip.Root>
									</Tooltip.Provider>
								</div>
								<!-- Botao - SheetFinanceiro -->
								{#if status === 'Aguardando Pagamento'}
									<SheetFinanceiroGrupo grupo={group} {cargo} {status} />
								{:else if status === 'Pago'}
									<SheetFinanceiroGrupo grupo={group} {cargo} {status} />
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Paginação -->
		{#if paginatedGroups.length > 0 && totalPages > 1}
			<div class="fixed bottom-6 left-1/2 z-10 -translate-x-1/2 transform">
				<div
					class="flex items-center gap-1 rounded-full border border-gray-700/50 bg-zinc-900/50 px-4 py-2"
				>
					<Button
						variant="ghost"
						size="sm"
						class="mr-2 size-8 p-0 text-amber-400 hover:bg-gray-700/50 hover:text-amber-400"
						aria-label="Página anterior"
						onclick={previousPage}
						disabled={currentPage === 1}
					>
						<CircleArrowLeftIcon class="size-6" />
					</Button>

					{#each pages as page}
						<Button
							variant={currentPage === page ? 'default' : 'ghost'}
							size="sm"
							class="size-8 p-0 {currentPage === page
								? 'bg-amber-500 text-white hover:bg-amber-600'
								: 'text-gray-400 hover:bg-gray-700/50 hover:text-amber-400'}"
							onclick={() => goToPage(page)}
						>
							{page}
						</Button>
					{/each}

					<Button
						variant="ghost"
						size="sm"
						class="ml-2 size-8 p-0 text-amber-400 hover:bg-gray-700/50 hover:text-amber-400"
						aria-label="Próxima página"
						onclick={nextPage}
						disabled={currentPage === totalPages}
					>
						<CircleArrowRight class="size-6" />
					</Button>
				</div>
			</div>
		{/if}
	</div>
{:catch error}
	<div
		class="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6"
	>
		<div class="text-center">
			<div
				class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-red-700/50 bg-red-900/30"
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
			<p class="text-xl font-medium text-red-400">Erro ao carregar leads</p>
			<p class="mt-2 text-gray-400">{error.message}</p>
		</div>
	</div>
{/await}
