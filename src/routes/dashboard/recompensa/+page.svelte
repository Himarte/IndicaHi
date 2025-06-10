<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	import { Check, DollarSign, Star, Sparkles, Trophy, Gift } from '@lucide/svelte';
	import type { PageData } from './$types';
	import type { User } from '$lib/server/auth';
	import { page } from '$app/stores';
	import { navigating } from '$app/stores';
	import IsLoading from './_components/IsLoading.svelte';
	import AnimationBg from './_components/AnimationBg.svelte';
	import ResgatarRecompensa from '$lib/components/Dialogs/ResgatarRecompensa.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Estados da página
	let isLoading = $derived($navigating || !data.userData);
	let currentUserData = $derived(data.userData as User);
	let currentProgress = $derived(currentUserData?.bonusIndicacao || 0);
	let showResgateDialog = $state(false);

	// Configuração dos milestones de recompensa
	const milestones = [
		{ id: 1, referrals: 0, reward: 0, completed: false },
		{ id: 2, referrals: 5, reward: 20, completed: false },
		{ id: 3, referrals: 10, reward: 45, completed: false },
		{ id: 4, referrals: 15, reward: 75, completed: false },
		{ id: 5, referrals: 20, reward: 150, completed: false, special: true }
	];

	// Cálculos baseados no progresso atual
	let milestonesWithProgress = $derived(
		milestones.map((milestone) => ({
			...milestone,
			completed: currentProgress >= milestone.referrals
		}))
	);

	// Calcular valor disponível para resgate
	let availableReward = $derived(
		(() => {
			const maiorMilestoneAtingido = milestones
				.filter((milestone) => currentProgress >= milestone.referrals && milestone.reward > 0)
				.sort((a, b) => b.referrals - a.referrals)[0];

			return maiorMilestoneAtingido ? maiorMilestoneAtingido.reward : 0;
		})()
	);

	let nextMilestone = $derived(milestonesWithProgress.find((m) => !m.completed));
	let completedMilestones = $derived(milestonesWithProgress.filter((m) => m.completed).length);
	let remainingReferrals = $derived(nextMilestone ? nextMilestone.referrals - currentProgress : 0);
</script>

<!-- Background with animated particles -->
<div class="relative flex min-h-screen w-full flex-col items-center justify-center">
	<!-- Background Animado -->
	<AnimationBg />
	<div
		class="relative z-10 flex h-full w-full max-w-6xl flex-col gap-8 px-2 py-8 md:gap-12 md:px-6 md:py-16 lg:px-8"
	>
		<!-- Page Header -->
		<header
			class="flex flex-col items-center gap-4 px-2 pt-10 text-center md:gap-8 md:px-0 md:pt-0"
		>
			<div class="flex items-center gap-3 md:gap-6">
				<div class="relative">
					<Sparkles class="animate-spin-slow h-8 w-8 text-orange-400 md:h-12 md:w-12" />
					<div
						class="absolute inset-0 h-8 w-8 animate-ping text-orange-300 opacity-20 md:h-12 md:w-12"
					>
						<Sparkles class="h-8 w-8 md:h-12 md:w-12" />
					</div>
				</div>
				<h1
					class="bg-gradient-to-r from-orange-400 via-yellow-300 to-emerald-400 bg-clip-text text-4xl font-black text-transparent drop-shadow-2xl md:text-6xl"
				>
					Recompensas Extras
				</h1>
				<div class="relative">
					<Trophy class="animate-bounce-slow h-8 w-8 text-yellow-400 md:h-12 md:w-12" />
					<div
						class="absolute inset-0 h-8 w-8 animate-ping text-yellow-300 opacity-20 md:h-12 md:w-12"
					>
						<Trophy class="h-8 w-8 md:h-12 md:w-12" />
					</div>
				</div>
			</div>
		</header>

		{#if isLoading}
			<IsLoading />
		{:else}
			<!-- Content when loaded -->
			<!-- Progress Card -->
			<div
				class="relative flex w-full flex-col rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 p-4 shadow-2xl backdrop-blur-xl md:p-10"
			>
				<!-- Enhanced card glow effects -->
				<div
					class="animate-pulse-glow absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-orange-400/15 to-yellow-500/10 blur-2xl"
				></div>
				<div
					class="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-orange-400/20 to-yellow-500/20 opacity-50 blur-xl"
				></div>

				<div class="relative z-10 flex flex-col gap-6 md:gap-8">
					<!-- Header with enhanced styling -->
					<div class="flex flex-col items-center gap-2 text-center">
						<div class="mb-3 flex items-center gap-2 md:gap-4">
							<Gift class="h-6 w-6 animate-bounce text-orange-400 md:h-10 md:w-10" />
							<h2
								class="bg-gradient-to-r from-orange-400 via-yellow-300 to-emerald-400 bg-clip-text text-3xl font-black text-transparent md:text-3xl"
							>
								Seu Progresso
							</h2>
							<Gift
								class="h-6 w-6 animate-bounce text-orange-400 md:h-10 md:w-10"
								style="animation-delay: 0.5s;"
							/>
						</div>
						<p class="text-base font-medium text-slate-200 md:text-lg">
							Voce pode resgatar o valor disponivel em suas conquistas abaixo.
						</p>
					</div>

					<!-- Enhanced Milestones -->
					<div
						class=" flex items-center justify-center gap-2 overflow-x-auto pb-4 md:gap-6 md:overflow-x-visible md:pb-0"
					>
						<!-- Representação visual das indicações (similar ao BonusIndicador) -->
						<div class=" relative flex w-full min-w-max justify-center px-2 md:max-w-full md:px-0">
							<!-- Marco inicial (0 indicações) -->
							<div class="flex flex-col items-center gap-2 md:gap-3">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30 md:h-14 md:w-14"
								>
									<Check class="h-5 w-5 text-white drop-shadow-sm md:h-7 md:w-7" />
								</div>
								<span class="text-xs font-bold text-emerald-400">Início</span>
							</div>

							<!-- Indicações 1-5 -->
							{#each Array(5) as _, i}
								{#if currentProgress > i}
									<Separator
										orientation="horizontal"
										class="mt-4 h-1.5 w-4 bg-emerald-500 shadow-lg shadow-emerald-500/25 md:mt-6 md:h-2 md:w-8"
									/>
								{:else}
									<Separator
										orientation="horizontal"
										class="mt-4 h-1.5 w-4 border border-slate-600 bg-slate-700 md:mt-6 md:h-2 md:w-8"
									/>
								{/if}
							{/each}

							<!-- Marco 5 indicações -->
							<div class="flex flex-col items-center gap-2 md:gap-3">
								{#if currentProgress >= 5}
									<div
										class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/40 md:h-14 md:w-14"
									>
										<Check class="h-5 w-5 text-white drop-shadow-sm md:h-7 md:w-7" />
									</div>
									<div class="relative flex justify-center pt-5 text-nowrap">
										<div class="absolute top-0 text-xs font-bold text-emerald-400">
											5 Indicações
										</div>
										<div
											class="rounded bg-slate-800/50 px-1.5 py-0.5 text-xs font-semibold text-yellow-400 md:px-2 md:py-1"
										>
											R$ 20
										</div>
									</div>
								{:else}
									<div
										class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-600 bg-slate-800 shadow-lg md:h-14 md:w-14"
									>
										<DollarSign class="h-5 w-5 text-slate-400 md:h-7 md:w-7" />
									</div>
									<div class="relative flex justify-center pt-5 text-nowrap">
										<div class="absolute top-0 text-xs font-bold text-slate-400">5 Indicações</div>
										<div
											class="rounded bg-slate-800/50 px-1.5 py-0.5 text-xs font-semibold text-slate-500 md:px-2 md:py-1"
										>
											R$ 20
										</div>
									</div>
								{/if}
							</div>

							<!-- Indicações 6-10 -->
							{#each Array(5) as _, i}
								{#if currentProgress > i + 5}
									<Separator
										orientation="horizontal"
										class="mt-4 h-1.5 w-4 bg-emerald-500 shadow-lg shadow-emerald-500/25 md:mt-6 md:h-2 md:w-8"
									/>
								{:else}
									<Separator
										orientation="horizontal"
										class="mt-4 h-1.5 w-4 border border-slate-600 bg-slate-700 md:mt-6 md:h-2 md:w-8"
									/>
								{/if}
							{/each}

							<!-- Marco 10 indicações -->
							<div class="flex flex-col items-center gap-2 md:gap-3">
								{#if currentProgress >= 10}
									<div
										class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/40 md:h-14 md:w-14"
									>
										<Check class="h-5 w-5 text-white drop-shadow-sm md:h-7 md:w-7" />
									</div>
									<div class="relative flex justify-center pt-5 text-nowrap">
										<div class="absolute top-0 text-xs font-bold text-emerald-400">
											10 Indicações
										</div>
										<div
											class="rounded bg-slate-800/50 px-1.5 py-0.5 text-xs font-semibold text-yellow-400 md:px-2 md:py-1"
										>
											R$ 45
										</div>
									</div>
								{:else}
									<div
										class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-600 bg-slate-800 shadow-lg md:h-14 md:w-14"
									>
										<DollarSign class="h-5 w-5 text-slate-400 md:h-7 md:w-7" />
									</div>
									<div class="relative flex justify-center pt-5 text-nowrap">
										<div class="absolute top-0 text-xs font-bold text-slate-400">10 Indicações</div>
										<div
											class="rounded bg-slate-800/50 px-1.5 py-0.5 text-xs font-semibold text-slate-500 md:px-2 md:py-1"
										>
											R$ 45
										</div>
									</div>
								{/if}
							</div>

							<!-- Indicações 11-15 -->
							{#each Array(5) as _, i}
								{#if currentProgress > i + 10}
									<Separator
										orientation="horizontal"
										class="mt-4 h-1.5 w-4 bg-emerald-500 shadow-lg shadow-emerald-500/25 md:mt-6 md:h-2 md:w-8"
									/>
								{:else}
									<Separator
										orientation="horizontal"
										class="mt-4 h-1.5 w-4 border border-slate-600 bg-slate-700 md:mt-6 md:h-2 md:w-8"
									/>
								{/if}
							{/each}

							<!-- Marco 15 indicações -->
							<div class="flex flex-col items-center gap-2 md:gap-3">
								{#if currentProgress >= 15}
									<div
										class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/40 md:h-14 md:w-14"
									>
										<Check class="h-5 w-5 text-white drop-shadow-sm md:h-7 md:w-7" />
									</div>
									<div class="relative flex justify-center pt-5 text-nowrap">
										<div class="absolute top-0 text-xs font-bold text-emerald-400">
											15 Indicações
										</div>
										<div
											class="rounded bg-slate-800/50 px-1.5 py-0.5 text-xs font-semibold text-yellow-400 md:px-2 md:py-1"
										>
											R$ 75
										</div>
									</div>
								{:else}
									<div
										class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-600 bg-slate-800 shadow-lg md:h-14 md:w-14"
									>
										<DollarSign class="h-5 w-5 text-slate-400 md:h-7 md:w-7" />
									</div>
									<div class="relative flex justify-center pt-5 text-nowrap">
										<div class="absolute top-0 text-xs font-bold text-slate-400">15 Indicações</div>
										<div
											class="rounded bg-slate-800/50 px-1.5 py-0.5 text-xs font-semibold text-slate-500 md:px-2 md:py-1"
										>
											R$ 75
										</div>
									</div>
								{/if}
							</div>

							<!-- Indicações 16-20 -->
							{#each Array(5) as _, i}
								{#if currentProgress > i + 15}
									<Separator
										orientation="horizontal"
										class="mt-4 h-1.5 w-4 bg-emerald-500 shadow-lg shadow-emerald-500/25 md:mt-6 md:h-2 md:w-8"
									/>
								{:else}
									<Separator
										orientation="horizontal"
										class="mt-4 h-1.5 w-4 border border-slate-600 bg-slate-700 md:mt-6 md:h-2 md:w-8"
									/>
								{/if}
							{/each}

							<!-- Marco final 20 indicações (especial) -->
							<div class="flex flex-col items-center gap-2 md:gap-3">
								{#if currentProgress >= 20}
									<div
										class="flex h-12 w-12 animate-pulse items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 shadow-xl shadow-orange-500/50 md:h-16 md:w-16"
									>
										<Star class="h-6 w-6 text-white drop-shadow-lg md:h-9 md:w-9" />
									</div>
									<div class="relative flex justify-center pt-5 text-nowrap">
										<div class="absolute top-0 text-xs font-bold text-yellow-300">
											20 Indicações
										</div>
										<div
											class="rounded-lg bg-slate-800/70 px-2 py-0.5 text-xs font-bold text-yellow-400 md:px-3 md:py-1 md:text-sm"
										>
											R$ 150
										</div>
										<div class="text-xs font-bold text-orange-400">🎉 MÁXIMO! 🎉</div>
									</div>
								{:else}
									<div
										class="flex h-12 w-12 animate-pulse items-center justify-center rounded-full border-3 border-orange-400 bg-slate-800 shadow-xl shadow-orange-400/30 md:h-16 md:w-16"
									>
										<Star class="h-6 w-6 text-orange-400 drop-shadow-sm md:h-9 md:w-9" />
									</div>
									<div class="relative flex justify-center pt-5 text-nowrap">
										<div class="absolute top-0 text-xs font-bold text-orange-300">
											20 Indicações
										</div>
										<div
											class="rounded-lg bg-slate-800/70 px-2 py-0.5 text-xs font-bold text-orange-400 md:px-3 md:py-1 md:text-sm"
										>
											R$ 150
										</div>
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>

				<!-- Progress Summary -->
				<div class="flex justify-center px-2 md:px-0">
					<div
						class="inline-flex flex-col items-center gap-3 rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-500/15 via-green-400/10 to-emerald-500/15 px-4 py-2 shadow-xl backdrop-blur-sm md:flex-row md:gap-6 md:px-8 md:py-3"
					>
						<div class="flex items-center gap-2 md:gap-3">
							<div
								class="h-3 w-3 animate-pulse rounded-full bg-emerald-400 shadow-sm md:h-4 md:w-4"
							></div>
							<span class="text-sm font-bold text-white md:text-lg">
								Progresso Atual:
								<span class="text-base text-emerald-400 md:text-xl">{currentProgress}</span>
								<span class="text-slate-300">/ 20 indicações</span>
							</span>
						</div>

						<Separator orientation="vertical" class="hidden h-6 w-px bg-slate-500 md:block" />

						<div class="flex items-center gap-2 md:gap-3">
							<Trophy class="h-4 w-4 text-yellow-400 md:h-6 md:w-6" />
							<span class="text-sm font-bold text-white md:text-lg">
								Conquistas: <span class="text-base text-yellow-400 md:text-xl"
									>{completedMilestones}</span
								>
								<span class="text-slate-300">/ 5</span>
							</span>
						</div>
					</div>
				</div>

				<!-- Next Milestone Info -->
				{#if nextMilestone}
					<div
						class="relative mt-6 rounded-2xl border border-orange-400/50 bg-gradient-to-r from-orange-500/15 via-yellow-400/10 to-orange-500/15 p-3 shadow-2xl backdrop-blur-sm md:mt-8 md:p-4"
					>
						<div class="relative flex flex-col items-center gap-2 text-center md:gap-3">
							<div class="flex items-center gap-2 md:gap-3">
								<Gift class="h-5 w-5 text-orange-400 md:h-7 md:w-7" />
								<h3 class="text-lg font-bold text-white md:text-2xl">Próxima Recompensa</h3>
								<Gift class="h-5 w-5 text-orange-400 md:h-7 md:w-7" />
							</div>

							<div class="flex flex-row items-center gap-2 md:gap-2">
								<span class="text-sm font-medium text-slate-200 md:text-lg">Faltam apenas</span>
								<span
									class="rounded-lg bg-slate-800/60 px-2 py-1 text-lg font-black text-orange-400 drop-shadow-xl md:px-3 md:text-xl"
								>
									{remainingReferrals} indicações
								</span>
								<span class="text-sm font-medium text-slate-200 md:text-lg">para ganhar</span>
							</div>
							<div class="flex items-center gap-4">
								<span class="text-3xl font-black text-emerald-400 drop-shadow-xl md:text-5xl">
									R$ {nextMilestone.reward}
								</span>
							</div>
						</div>
					</div>
				{:else}
					<div
						class="relative rounded-2xl border border-yellow-400/60 bg-gradient-to-r from-yellow-500/20 via-emerald-500/15 to-yellow-500/20 p-8 shadow-2xl backdrop-blur-sm"
					>
						<div class="relative text-center">
							<div class="mb-6 flex justify-center gap-3">
								<Trophy class="h-10 w-10 animate-bounce text-yellow-400" />
								<Star
									class="h-10 w-10 animate-bounce text-orange-400"
									style="animation-delay: 0.2s;"
								/>
								<Gift
									class="h-10 w-10 animate-bounce text-emerald-400"
									style="animation-delay: 0.4s;"
								/>
							</div>
							<p class="mb-3 text-4xl font-black text-yellow-400">🎉 PARABÉNS! 🎉</p>
							<p class="mb-2 text-2xl font-bold text-emerald-400">
								Você completou todos os marcos de indicação!
							</p>
							<p class="text-lg text-slate-200">Continue indicando para manter seu bônus ativo!</p>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Enhanced floating action button -->
	{#if availableReward <= 0 || isLoading}
		<div class="fixed bottom-6 left-1/2 z-20 -translate-x-1/2 md:bottom-10">
			<Button
				size="lg"
				class="animate-float-button relative h-12 w-auto overflow-hidden border-2 border-emerald-400/50 bg-gradient-to-r from-emerald-600 via-orange-500 to-yellow-600 text-lg font-bold text-white shadow-2xl shadow-emerald-500/50 transition-all duration-300 hover:scale-110 hover:from-orange-500 hover:via-emerald-400 hover:to-yellow-500 hover:shadow-emerald-500/70 md:h-14 md:text-xl"
				disabled
			>
				<span class="relative z-10 flex items-center gap-2 px-4 md:gap-3 md:px-6">
					<Sparkles class="animate-spin-slow h-5 w-5 md:h-7 md:w-7" />
					<span class="hidden md:inline">Sem Recompensa Disponível</span>
					<span class="md:hidden">Sem Recompensa</span>
					<Gift class="h-5 w-5 md:h-7 md:w-7" />
				</span>
				<!-- Enhanced button glow effects -->
				<div
					class="animate-pulse-glow absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-orange-500/30 blur-2xl"
				></div>
				<div
					class="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
				></div>
			</Button>
		</div>
	{:else}
		<div class="fixed bottom-10 left-1/2 z-20 -translate-x-1/2 md:bottom-16">
			<Button
				size="lg"
				class="animate-float-button relative h-12 w-auto overflow-hidden border-2 border-emerald-400/50 bg-gradient-to-r from-emerald-600 via-orange-500 to-yellow-600 text-lg font-bold text-white shadow-2xl shadow-emerald-500/50 transition-all duration-300 hover:scale-110 hover:from-orange-500 hover:via-emerald-400 hover:to-yellow-500 hover:shadow-emerald-500/70 md:h-14 md:text-xl"
				onclick={() => {
					showResgateDialog = true;
				}}
			>
				<span class="relative z-10 flex items-center gap-2 px-4 md:gap-3 md:px-6">
					<Sparkles class="animate-spin-slow h-5 w-5 md:h-7 md:w-7" />
					<span class="hidden md:inline">Resgatar R$ {availableReward}</span>
					<span class="md:hidden">Resgatar R$ {availableReward}</span>
					<Gift class="h-5 w-5 md:h-7 md:w-7" />
				</span>
				<!-- Enhanced button glow effects -->
				<div
					class="animate-pulse-glow absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-orange-500/30 blur-2xl"
				></div>
				<div
					class="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
				></div>
			</Button>
		</div>
	{/if}
</div>

<!-- Dialog de Resgate que abre quando o usuário tem recompensa disponível -->
<ResgatarRecompensa userData={currentUserData} bind:open={showResgateDialog} {availableReward} />

<style>
	.animate-ping {
		animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
	}

	.animate-pulse-glow {
		animation: pulse-glow 3s ease-in-out infinite;
	}

	.animate-shimmer {
		animation: shimmer 2s ease-in-out infinite;
	}

	.border-3 {
		border-width: 3px;
	}

	@keyframes ping {
		75%,
		100% {
			transform: scale(2);
			opacity: 0;
		}
	}

	@keyframes pulse-glow {
		0%,
		100% {
			opacity: 0.5;
		}
		50% {
			opacity: 0.8;
		}
	}

	@keyframes shimmer {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}

	@keyframes float-button {
		0%,
		100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-5px);
		}
	}
</style>
