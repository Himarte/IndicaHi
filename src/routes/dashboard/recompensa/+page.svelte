<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	import { Check, DollarSign, Star, Sparkles, Trophy, Gift } from 'lucide-svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	export let foo: () => void = () => {}; // Callback prop for component events

	let currentProgress = 2; // User has completed 2 milestones

	const milestones = [
		{ id: 1, referrals: 0, reward: 0, completed: true },
		{ id: 2, referrals: 5, reward: 20, completed: true },
		{ id: 3, referrals: 10, reward: 45, completed: true },
		{ id: 4, referrals: 15, reward: 75, completed: false },
		{ id: 5, referrals: 20, reward: 100, completed: false },
		{ id: 6, referrals: 25, reward: 150, completed: false, special: true }
	];

	$: nextMilestone = milestones.find((m) => !m.completed);
	$: completedMilestones = milestones.filter((m) => m.completed).length;
	$: remainingReferrals = nextMilestone ? nextMilestone.referrals - currentProgress * 5 : 0;
</script>

<!-- Background with animated particles -->
<div class="relative flex min-h-screen w-full flex-col items-center justify-center">
	<!-- Animated background elements -->
	<div class="absolute inset-0 overflow-hidden">
		<div
			class="animate-float absolute -right-40 -top-40 h-80 w-80 rounded-full bg-gradient-to-br from-orange-400/20 to-pink-600/20 blur-3xl"
		></div>
		<div
			class="animate-float-delayed absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-red-400/20 to-orange-600/20 blur-3xl"
		></div>
		<div
			class="animate-pulse-slow absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-red-400/10 to-orange-600/10 blur-3xl"
		></div>
	</div>

	<div
		class="relative z-10 flex h-full w-full max-w-6xl flex-col gap-12 px-4 py-16 sm:px-6 lg:px-8"
	>
		<!-- Page Header -->
		<header class="flex flex-col items-center gap-8 text-center">
			<div class="flex items-center gap-4">
				<div class="relative">
					<Sparkles class="animate-spin-slow h-10 w-10 text-orange-500" />
					<div class="absolute inset-0 h-10 w-10 animate-ping text-orange-300 opacity-20">
						<Sparkles class="h-10 w-10" />
					</div>
				</div>
				<h1
					class="animate-gradient bg-gradient-to-r from-red-400 via-orange-300 to-pink-400 bg-clip-text text-6xl font-black text-transparent drop-shadow-2xl"
				>
					Sistema de Recompensas
				</h1>
				<div class="relative">
					<Trophy class="animate-bounce-slow h-10 w-10 text-yellow-500" />
					<div class="absolute inset-0 h-10 w-10 animate-ping text-yellow-300 opacity-20">
						<Trophy class="h-10 w-10" />
					</div>
				</div>
			</div>
		</header>

		<!-- Progress Card -->
		<div
			class="relative flex w-full flex-col rounded-3xl border-2 border-orange-500/30 bg-gradient-to-br from-slate-800/90 via-slate-900/95 to-slate-800/90 p-10 shadow-2xl backdrop-blur-xl"
		>
			<!-- Enhanced card glow effects -->
			<div
				class="animate-pulse-glow absolute inset-0 rounded-3xl bg-gradient-to-r from-red-500/10 via-orange-400/15 to-pink-500/10 blur-2xl"
			></div>
			<div
				class="absolute -inset-1 rounded-3xl bg-gradient-to-r from-red-500/20 via-orange-400/20 to-pink-500/20 opacity-50 blur-xl"
			></div>

			<div class="relative z-10 flex flex-col gap-10">
				<!-- Header with enhanced styling -->
				<div class="flex flex-col items-center gap-4 text-center">
					<div class="mb-2 flex items-center gap-3">
						<Gift class="h-8 w-8 animate-bounce text-orange-400" />
						<h2
							class="bg-gradient-to-r from-red-400 via-orange-300 to-pink-400 bg-clip-text text-4xl font-black text-transparent"
						>
							Seu Progresso
						</h2>
						<Gift class="h-8 w-8 animate-bounce text-orange-400" style="animation-delay: 0.5s;" />
					</div>
					<p class="text-lg font-medium text-slate-300">
						Realize indicações e lucre mais ainda com nossas recompensas!
					</p>
				</div>

				<!-- Enhanced Milestones -->
				<div class="flex items-center justify-between gap-6 md:gap-8">
					{#each milestones as milestone, index}
						<div class="group relative flex flex-col items-center gap-5">
							<!-- Enhanced connection line -->
							{#if index < milestones.length - 1}
								<Separator
									class="absolute left-[70px] top-10 z-0 hidden h-1 w-[150%] transition-all duration-700 md:block {milestone.completed
										? 'bg-gradient-to-r from-red-500 via-orange-400 to-pink-500 shadow-lg shadow-orange-500/50'
										: 'bg-slate-600/50'}"
								/>
							{/if}

							<!-- Enhanced milestone circle -->
							<div
								class="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-slate-800 transition-all duration-500 group-hover:scale-125 {milestone.completed
									? 'animate-glow bg-gradient-to-br from-red-500 via-orange-400 to-pink-500 shadow-2xl shadow-orange-500/50'
									: milestone.special
										? 'animate-pulse-rainbow bg-gradient-to-br from-red-500 via-orange-500 to-pink-500 shadow-2xl shadow-orange-500/50'
										: 'border-3 border-slate-500 bg-slate-700/80 shadow-xl'}"
							>
								<!-- Enhanced icons -->
								{#if milestone.completed}
									<Check class="h-8 w-8 text-white drop-shadow-lg" />
								{:else if milestone.special}
									<Star class="h-8 w-8 text-white drop-shadow-lg" />
								{:else}
									<DollarSign
										class="h-8 w-8 text-slate-400 transition-colors duration-300 group-hover:text-orange-400"
									/>
								{/if}

								<!-- Enhanced pulse animation for next milestone -->
								{#if !milestone.completed && milestone === nextMilestone}
									<div
										class="animate-ping-slow absolute inset-0 rounded-full bg-gradient-to-r from-red-500 via-orange-400 to-pink-500 opacity-40"
									></div>
									<div
										class="animate-pulse-ring absolute inset-0 rounded-full bg-gradient-to-r from-red-500 via-orange-400 to-pink-500 opacity-20"
									></div>
								{/if}
							</div>

							<!-- Enhanced milestone info -->
							<div class="flex flex-col items-center gap-2 text-center">
								<div
									class="text-xs font-bold uppercase tracking-widest text-slate-400 transition-colors duration-300 group-hover:text-orange-400"
								>
									Indicações
								</div>
								<div
									class="text-2xl font-black transition-all duration-300 {milestone.completed
										? 'text-orange-400 drop-shadow-lg'
										: 'text-slate-400 group-hover:text-slate-300'}"
								>
									{milestone.referrals}
								</div>
								<div
									class="rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 {milestone.completed
										? 'border-2 border-orange-400/50 bg-gradient-to-r from-red-500/30 to-orange-500/30 text-white shadow-lg shadow-orange-500/25'
										: milestone.special
											? 'border-2 border-pink-400/50 bg-gradient-to-r from-red-500/30 to-pink-500/30 text-white shadow-lg shadow-pink-500/25'
											: 'bg-slate-600/50 text-slate-300 group-hover:bg-slate-500/50'}"
								>
									R$ {milestone.reward}
								</div>
							</div>
						</div>
					{/each}
				</div>

				<!-- Enhanced progress summary -->
				<div class="flex justify-center">
					<div
						class="inline-flex items-center gap-4 rounded-full border-2 border-orange-500/30 bg-gradient-to-r from-red-500/20 via-orange-400/20 to-pink-500/20 px-8 py-4 shadow-xl backdrop-blur-sm"
					>
						<div class="relative">
							<div
								class="animate-pulse-fast h-4 w-4 rounded-full bg-gradient-to-r from-red-500 via-orange-400 to-pink-400"
							></div>
							<div
								class="absolute inset-0 h-4 w-4 animate-ping rounded-full bg-orange-400 opacity-30"
							></div>
						</div>
						<span class="text-lg font-bold text-white">
							{completedMilestones} de {milestones.length} marcos concluídos
						</span>
					</div>
				</div>

				<!-- Enhanced next milestone info -->
				{#if nextMilestone}
					<div
						class="relative rounded-2xl border-2 border-orange-500/40 bg-gradient-to-r from-red-500/20 via-orange-400/20 to-pink-500/20 p-3 shadow-2xl backdrop-blur-sm"
					>
						<div
							class="animate-pulse-glow absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/10 to-orange-500/10 blur-xl"
						></div>
						<div class="relative flex flex-col items-center gap-3 text-center">
							<p class="text-lg font-medium text-slate-300">
								Próxima recompensa em
								<span class="animate-bounce-text text-xl font-black text-orange-400">
									{remainingReferrals} indicações
								</span>
							</p>
							<p
								class="animate-gradient bg-gradient-to-r from-red-400 via-orange-300 to-pink-400 bg-clip-text text-4xl font-black text-transparent"
							>
								R$ {nextMilestone.reward}
							</p>
						</div>
					</div>
				{:else}
					<div
						class="relative rounded-2xl border-2 border-pink-500/50 bg-gradient-to-r from-red-500/30 via-orange-500/30 to-pink-500/30 p-8 shadow-2xl backdrop-blur-sm"
					>
						<div
							class="animate-pulse-rainbow absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-xl"
						></div>
						<div class="relative text-center">
							<p
								class="animate-gradient bg-gradient-to-r from-red-400 via-orange-400 to-pink-400 bg-clip-text text-2xl font-black text-transparent"
							>
								🎉 Parabéns! Você completou todos os marcos! 🎉
							</p>
							<div class="mt-4 flex justify-center gap-2">
								<Trophy class="h-6 w-6 animate-bounce text-yellow-400" />
								<Star
									class="h-6 w-6 animate-bounce text-orange-400"
									style="animation-delay: 0.2s;"
								/>
								<Gift class="h-6 w-6 animate-bounce text-pink-400" style="animation-delay: 0.4s;" />
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Enhanced floating action button -->
	<div class="fixed bottom-10 left-1/2 z-20 -translate-x-1/2">
		<a href="/dashboard/recompensa2" class="h-full w-full">
			<Button
				size="lg"
				class="animate-float-button relative h-12 w-full overflow-hidden border-2 border-orange-400/50 bg-gradient-to-r from-red-600 via-orange-500 to-pink-600 text-xl font-bold text-white shadow-2xl shadow-orange-500/50 transition-all duration-300 hover:scale-110 hover:from-orange-500 hover:via-red-400 hover:to-pink-500 hover:shadow-orange-500/70"
				on:click={() => foo()}
			>
				<span class="relative z-10 flex items-center gap-3 px-1">
					<Sparkles class="animate-spin-slow h-6 w-6" />
					Resgatar Recompensa
				</span>
				<!-- Enhanced button glow effects -->
				<div
					class="animate-pulse-glow absolute inset-0 bg-gradient-to-r from-red-500/30 to-orange-500/30 blur-2xl"
				></div>
				<div
					class="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
				></div>
			</Button>
		</a>
	</div>
</div>

<style>
	/* Animações utilizadas */
	.animate-ping {
		animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
	}

	.animate-pulse-slow {
		animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	.animate-pulse-fast {
		animation: pulse 0.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	.animate-float {
		animation: float 6s ease-in-out infinite;
	}

	.animate-float-delayed {
		animation: float 6s ease-in-out infinite;
		animation-delay: 3s;
	}

	.animate-gradient {
		background-size: 200% 200%;
		animation: gradient 3s ease infinite;
	}

	.animate-shimmer {
		animation: shimmer 2s ease-in-out infinite;
	}

	.animate-glow {
		animation: glow 2s ease-in-out infinite alternate;
	}

	.animate-pulse-glow {
		animation: pulse-glow 3s ease-in-out infinite;
	}

	.animate-pulse-rainbow {
		animation: pulse-rainbow 2s ease-in-out infinite;
	}

	.animate-ping-slow {
		animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
	}

	.animate-pulse-ring {
		animation: pulse-ring 2s cubic-bezier(0, 0, 0.2, 1) infinite;
	}

	.animate-bounce-text {
		animation: bounce-text 2s ease-in-out infinite;
	}

	/* Keyframes utilizados */
	@keyframes ping {
		75%,
		100% {
			transform: scale(2);
			opacity: 0;
		}
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.7;
		}
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-20px);
		}
	}

	@keyframes gradient {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
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

	@keyframes glow {
		0% {
			box-shadow: 0 0 20px rgba(251, 146, 60, 0.5);
		}
		100% {
			box-shadow: 0 0 40px rgba(251, 146, 60, 0.8);
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

	@keyframes pulse-rainbow {
		0%,
		100% {
			opacity: 0.6;
		}
		50% {
			opacity: 1;
		}
	}

	@keyframes ping-slow {
		75%,
		100% {
			transform: scale(1.5);
			opacity: 0;
		}
	}

	@keyframes pulse-ring {
		0% {
			transform: scale(1);
			opacity: 0.3;
		}
		100% {
			transform: scale(1.8);
			opacity: 0;
		}
	}

	@keyframes bounce-text {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-3px);
		}
	}
</style>
