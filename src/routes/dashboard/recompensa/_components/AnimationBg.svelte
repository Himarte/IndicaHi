<div class="absolute inset-0 overflow-hidden">
	<!-- Círculo emerald no canto superior direito -->
	<div
		class="animate-float absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-emerald-400/15 to-green-500/20 blur-3xl"
	></div>

	<!-- Círculo laranja no canto inferior esquerdo -->
	<div
		class="animate-float-delayed absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-orange-400/15 to-yellow-500/20 blur-3xl"
	></div>

	<!-- Círculo central grande com mistura de cores -->
	<div
		class="animate-glow-pulse absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-emerald-400/8 via-orange-400/10 to-yellow-400/8 blur-3xl"
	></div>

	<!-- Círculos menores adicionais para mais dinâmica -->
	<div
		class="animate-drift absolute top-1/4 right-1/4 h-48 w-48 rounded-full bg-gradient-to-br from-yellow-400/12 to-emerald-400/15 blur-2xl"
		style="animation-delay: 1s;"
	></div>

	<div
		class="animate-drift absolute bottom-1/4 left-1/4 h-60 w-60 rounded-full bg-gradient-to-br from-orange-400/10 to-emerald-500/12 blur-2xl"
		style="animation-delay: 2s;"
	></div>

	<!-- Partículas menores flutuantes -->
	<div
		class="animate-glow-pulse absolute right-1/3 bottom-1/3 h-32 w-32 rounded-full bg-emerald-400/8 blur-xl"
		style="animation-delay: 0.5s;"
	></div>

	<div
		class="animate-drift absolute top-1/3 left-1/3 h-24 w-24 rounded-full bg-yellow-400/10 blur-xl"
		style="animation-delay: 1.5s;"
	></div>

	<!-- Elementos adicionais para mais profundidade -->
	<div
		class="animate-float absolute top-1/2 right-1/6 h-36 w-36 rounded-full bg-gradient-to-br from-emerald-500/6 to-orange-400/8 blur-xl"
		style="animation-delay: 3s;"
	></div>

	<div
		class="animate-glow-pulse absolute bottom-1/6 left-1/6 h-28 w-28 rounded-full bg-gradient-to-br from-yellow-400/8 to-emerald-400/6 blur-xl"
		style="animation-delay: 2.5s;"
	></div>
</div>

<style>
	.animate-float {
		animation: float 6s ease-in-out infinite;
	}

	.animate-float-delayed {
		animation: float 6s ease-in-out infinite;
		animation-delay: 3s;
	}

	.animate-drift {
		animation: drift 8s ease-in-out infinite;
	}

	.animate-glow-pulse {
		animation: glow-pulse 4s ease-in-out infinite;
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

	@keyframes drift {
		0% {
			transform: translateX(0px) translateY(0px);
		}
		33% {
			transform: translateX(30px) translateY(-30px);
		}
		66% {
			transform: translateX(-20px) translateY(20px);
		}
		100% {
			transform: translateX(0px) translateY(0px);
		}
	}

	@keyframes glow-pulse {
		0%,
		100% {
			opacity: 0.4;
			transform: scale(1);
		}
		50% {
			opacity: 0.8;
			transform: scale(1.05);
		}
	}
</style>
