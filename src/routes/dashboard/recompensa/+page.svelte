<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { PageData } from '../atividades/$types';

	export let data: PageData;
	import { Calendar, Gift, Star, ChevronRight } from 'lucide-svelte';

	let currentDay = 7;
	let streak = 12;
	let claimed = false;
	let rewardAmount = 250;

	const rewards = [
		{ day: 1, amount: 50, type: 'credits' },
		{ day: 2, amount: 75, type: 'credits' },
		{ day: 3, amount: 100, type: 'credits' },
		{ day: 4, amount: 150, type: 'credits' },
		{ day: 5, amount: 200, type: 'credits' },
		{ day: 6, amount: 300, type: 'credits' },
		{ day: 7, amount: 500, type: 'credits', special: true }
	];

	function claimReward() {
		claimed = true;
		// Add claim logic here
	}
</script>

<div class="min-h-screen bg-gray-900">
	<!-- Main Content -->
	<main class="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
		<!-- Page Header -->
		<div class="mb-16 text-center">
			<h1
				class="mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-5xl font-bold text-transparent"
			>
				Daily Rewards
			</h1>
			<p class="mx-auto max-w-2xl text-xl leading-relaxed text-gray-300">
				Claim your daily reward and build your streak. The longer your streak, the better the
				rewards!
			</p>
		</div>

		<!-- Streak Info -->
		<div class="mb-12 flex justify-center">
			<div
				class="flex items-center space-x-6 rounded-2xl border border-gray-700 bg-gray-800/50 px-8 py-4 backdrop-blur-sm"
			>
				<div class="flex items-center space-x-3">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-500"
					>
						<Calendar class="h-5 w-5 text-white" />
					</div>
					<span class="text-sm font-medium uppercase tracking-wide text-gray-300"
						>Current Streak</span
					>
				</div>
				<div class="text-3xl font-bold text-white">{streak} days</div>
			</div>
		</div>

		<!-- Daily Reward Panel -->
		<div class="relative mb-12">
			<!-- Glow effect -->
			<div
				class="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl"
			></div>

			<div class="relative rounded-3xl border border-gray-700 bg-gray-800/80 p-10 backdrop-blur-sm">
				<div class="text-center">
					<!-- Reward Icon -->
					<div class="relative mx-auto mb-8 h-24 w-24">
						<div
							class="absolute inset-0 animate-pulse rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
						></div>
						<div
							class="relative flex h-full w-full items-center justify-center rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
						>
							<Gift class="h-12 w-12 text-white" />
						</div>
					</div>

					<!-- Day Counter -->
					<div class="mb-6">
						<span
							class="rounded-full bg-gray-700/50 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-gray-400"
						>
							Day {currentDay}
						</span>
					</div>

					<!-- Reward Amount -->
					<div class="mb-8">
						<div
							class="mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-6xl font-bold text-transparent"
						>
							{rewardAmount}
						</div>
						<div class="text-xl font-medium text-gray-300">Credits</div>
					</div>

					<!-- Claim Button -->
					{#if !claimed}
						<button
							on:click={claimReward}
							class="group relative mx-auto flex transform items-center space-x-3 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-10 py-5 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
						>
							<span>Claim Reward</span>
							<ChevronRight class="h-6 w-6 transition-transform group-hover:translate-x-1" />
						</button>
					{:else}
						<div
							class="flex items-center justify-center space-x-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-10 py-5 text-lg font-semibold text-white shadow-lg shadow-green-500/25"
						>
							<Star class="h-6 w-6" />
							<span>Reward Claimed!</span>
						</div>
					{/if}

					<!-- Next Reward Preview -->
					<div class="mt-8 border-t border-gray-700 pt-8">
						<p class="mb-3 text-sm uppercase tracking-wide text-gray-400">Tomorrow's reward</p>
						<p class="text-2xl font-bold text-white">300 Credits</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Weekly Progress -->
		<div class="rounded-2xl border border-gray-700 bg-gray-800/50 p-8 backdrop-blur-sm">
			<h3 class="mb-6 text-center text-2xl font-bold text-white">Weekly Progress</h3>
			<div class="grid grid-cols-7 gap-4">
				{#each rewards as reward, index}
					<div class="text-center">
						<div
							class="relative mb-3 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 {index +
								1 <
							currentDay
								? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/25'
								: index + 1 === currentDay
									? 'scale-110 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/25'
									: 'bg-gray-700 hover:bg-gray-600'}"
						>
							{#if reward.special}
								<Star class="h-7 w-7 text-white" />
							{:else}
								<Gift class="h-6 w-6 text-white" />
							{/if}
						</div>
						<div class="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-300">
							Day {reward.day}
						</div>
						<div class="text-sm font-medium text-gray-400">{reward.amount}</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Additional Info -->
		<div class="mt-12 text-center">
			<p class="text-lg text-gray-400">
				Rewards reset daily at 12:00 AM UTC. Don't miss a day to keep your streak alive!
			</p>
		</div>
	</main>
</div>
