<!-- Loading State -->
<div
	class="relative flex w-full flex-col rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 p-10 shadow-2xl backdrop-blur-xl"
>
	<!-- Loading card glow effects -->
	<div
		class="animate-pulse-glow absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-orange-400/15 to-yellow-500/10 blur-2xl"
	></div>

	<div class="relative z-10 flex flex-col gap-12">
		<!-- Loading Header -->
		<div class="flex flex-col items-center gap-2 text-center">
			<div class="mb-3 flex items-center gap-4">
				<div
					class="animate-shimmer-loading h-10 w-10 animate-pulse rounded-full bg-slate-700"
				></div>
				<div class="animate-shimmer-loading h-12 w-80 animate-pulse rounded-lg bg-slate-700"></div>
				<div
					class="animate-shimmer-loading h-10 w-10 animate-pulse rounded-full bg-slate-700"
				></div>
			</div>
			<div class="animate-shimmer-loading h-6 w-96 animate-pulse rounded bg-slate-700"></div>
		</div>

		<!-- Loading Milestones -->
		<div class="flex items-center justify-center gap-4 md:gap-6">
			<div class="relative flex w-full max-w-full justify-center">
				<!-- Loading circles and separators -->
				{#each Array(5) as _, i}
					<div class="flex flex-col items-center gap-3">
						<div
							class="animate-shimmer-loading h-14 w-14 animate-pulse rounded-full bg-slate-700"
						></div>
						<div class="relative flex justify-center pt-5 text-nowrap">
							<div
								class="animate-shimmer-loading absolute top-0 h-3 w-16 animate-pulse rounded bg-slate-700"
							></div>
							<div
								class="animate-shimmer-loading h-6 w-12 animate-pulse rounded bg-slate-700"
							></div>
						</div>
					</div>

					{#if i < 4}
						{#each Array(5) as _}
							<div
								class="animate-shimmer-loading mt-6 h-2 w-8 animate-pulse rounded-full bg-slate-700"
							></div>
						{/each}
					{/if}
				{/each}
			</div>
		</div>

		<!-- Loading Progress Summary -->
		<div class="flex justify-center">
			<div class="animate-shimmer-loading h-16 w-96 animate-pulse rounded-2xl bg-slate-700"></div>
		</div>

		<!-- Loading Next Milestone -->
		<div class="animate-shimmer-loading h-32 w-full animate-pulse rounded-2xl bg-slate-700"></div>
	</div>
</div>

<style>
	.animate-pulse-glow {
		animation: pulse-glow 3s ease-in-out infinite;
	}

	.animate-shimmer-loading {
		position: relative;
		overflow: hidden;
	}

	.animate-shimmer-loading::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
		animation: shimmer-loading 2s infinite;
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

	@keyframes shimmer-loading {
		0% {
			left: -100%;
		}
		100% {
			left: 100%;
		}
	}
</style>
