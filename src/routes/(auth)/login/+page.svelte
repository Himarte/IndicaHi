<script lang="ts">
	import Paraqueda from '$lib/img/paraqueda.webp';
	import { Separator } from '$lib/components/ui/separator';
	import Rocket from '$lib/img/melhor.webp';
	import { Button } from '$lib/components/ui/button';
</script>

<div class="relative flex h-screen w-full overflow-hidden bg-zinc-950">
	<!-- Background gradient effects -->
	<div class="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black"></div>

	<div class="relative z-10 flex h-full w-full items-center">
		<!-- Left Side - Welcome Section -->
		<div class="relative hidden h-full w-1/2 flex-col items-center justify-center px-8 md:flex">
			<div
				class="absolute top-28 z-20 flex w-full flex-col items-center justify-center text-center"
			>
				<div class="flex flex-col items-center justify-center">
					<h1 class="mb-4 text-5xl leading-tight font-bold tracking-tight text-white">
						Bem-vindo!
					</h1>
					<div
						class="mx-auto mb-6 h-1 w-16 rounded-full bg-gradient-to-r from-orange-400 to-amber-500"
					></div>
				</div>
				<p class="max-w-md text-xl leading-relaxed font-light text-zinc-300">
					Vamos nessa jornada<br />
					juntos com a
					<span
						class="ml-1 bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text font-semibold text-transparent"
						>HIMARTE</span
					>
				</p>
			</div>

			<!-- Enhanced decorative gradient orbs -->
			<div
				class="absolute top-16 left-1/2 h-48 w-48 -translate-x-1/2 transform animate-pulse rounded-full bg-gradient-to-r from-orange-500/15 to-amber-500/15 blur-3xl"
			></div>
			<div
				class="absolute top-24 left-1/2 h-32 w-32 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-amber-400/20 to-orange-400/20 blur-2xl"
			></div>

			<img
				src={Rocket}
				loading="eager"
				alt="Imagem de um foguete decolando"
				class="absolute bottom-0 left-0 z-0 w-[95%] object-cover opacity-95"
			/>
		</div>

		<!-- Enhanced Separator -->
		<Separator
			orientation="vertical"
			class="hidden h-[70%] w-[1px] bg-gradient-to-b from-transparent via-zinc-700 to-transparent md:flex"
		/>

		<!-- Right Side - Login Form -->
		<div class="relative flex w-full justify-center px-6 py-20 md:w-1/2 md:px-8 md:py-0">
			<!-- Enhanced Parachute decoration -->
			<img
				src={Paraqueda}
				loading="eager"
				alt="Astronauta caindo de paraquedas"
				class="floating-animation absolute -top-16 right-4 z-[1] w-56 rotate-3 opacity-25 transition-opacity duration-500 hover:opacity-50 md:-top-20 md:right-8 md:w-72 md:rotate-6 md:opacity-35"
			/>

			<!-- Multiple layered glowing orb effects -->
			<div
				class="absolute -top-4 right-16 z-[2] h-28 w-28 animate-pulse rounded-full bg-gradient-to-r from-orange-400/20 to-amber-400/20 opacity-40 blur-2xl md:right-32 md:h-36 md:w-36"
			></div>
			<div
				class="absolute -top-2 right-18 z-[1] h-20 w-20 rounded-full bg-gradient-to-r from-amber-300/15 to-orange-300/15 opacity-60 blur-lg md:right-34 md:h-24 md:w-24"
			></div>

			<!-- Login Form Container -->
			<div class="z-10 flex h-full w-full max-w-sm flex-col justify-center gap-8">
				<!-- Enhanced Header -->
				<div class="flex flex-col space-y-4 text-center">
					<h2 class="mb-2 text-4xl font-bold tracking-tight text-white">Acesse sua conta</h2>
					<div
						class="mx-auto mb-2 h-1 w-12 rounded-full bg-gradient-to-r from-orange-400 to-amber-500"
					></div>
					<p class="text-sm font-medium text-zinc-400">Escolha uma opção para continuar</p>
				</div>

				<!-- Enhanced Login Buttons -->
				<div class="flex flex-col items-center gap-4">
					<!-- Google Button - Neutral Elegant -->
					<Button
						href="/login/google"
						class="group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-xl border border-zinc-700/50 bg-zinc-800/80 font-medium text-zinc-100 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-zinc-600/70 hover:bg-zinc-700/90 hover:shadow-xl hover:shadow-zinc-900/20"
					>
						<div
							class="absolute inset-0 bg-gradient-to-r from-zinc-800/0 via-zinc-700/50 to-zinc-800/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
						></div>
						<svg class="relative z-10 mr-3 h-5 w-5" viewBox="0 0 24 24">
							<path
								fill="#FFFFFF"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="#E5E7EB"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="#F3F4F6"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							/>
							<path
								fill="#D1D5DB"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
						<span class="relative z-10">Continuar com Google</span>
					</Button>

					<!-- Discord Button - Neutral Elegant -->
					<Button
						href="/login/discord"
						class="group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-xl border border-zinc-700/50 bg-zinc-800/80 font-medium text-zinc-100 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-zinc-600/70 hover:bg-zinc-700/90 hover:shadow-xl hover:shadow-zinc-900/20"
					>
						<div
							class="absolute inset-0 bg-gradient-to-r from-zinc-800/0 via-zinc-700/50 to-zinc-800/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
						></div>
						<svg class="relative z-10 mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
							/>
						</svg>
						<span class="relative z-10">Continuar com Discord</span>
					</Button>

					<!-- Third option - Enhanced placeholder -->
					<div
						class="group relative flex h-14 w-full cursor-not-allowed items-center justify-center overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900/50 font-medium text-zinc-400 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700/70 hover:bg-zinc-900/70"
					>
						<div
							class="absolute inset-0 bg-gradient-to-r from-zinc-900/0 via-zinc-800/30 to-zinc-900/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
						></div>
						<svg
							class="relative z-10 mr-3 h-5 w-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							/>
						</svg>
						<span class="relative z-10">Mais opções em breve</span>
					</div>
				</div>

				<!-- Enhanced Footer -->
				<div class="text-center">
					<p class="text-xs leading-relaxed text-zinc-500">
						Ao continuar, você concorda com nossos<br />
						<span
							class="cursor-pointer text-orange-400 underline decoration-dotted transition-colors duration-200 hover:text-orange-300"
							>termos de uso</span
						>
						e
						<span
							class="cursor-pointer text-orange-400 underline decoration-dotted transition-colors duration-200 hover:text-orange-300"
							>política de privacidade</span
						>
					</p>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	/* Enhanced animations */
	@keyframes float {
		0%,
		100% {
			transform: translateY(0px) rotate(6deg);
		}
		50% {
			transform: translateY(-12px) rotate(6deg);
		}
	}

	@keyframes pulse {
		0% {
			opacity: 0.4;
			transform: scale(1);
		}
		100% {
			opacity: 0.8;
			transform: scale(1.1);
		}
	}

	.floating-animation {
		animation: float 8s ease-in-out infinite;
	}

	/* Smooth transitions for all interactive elements */
	:global(.transition-all) {
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* Custom gradient text animation */
	@keyframes gradient-shift {
		0%,
		100% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
	}

	/* Enhanced backdrop blur support */
	@supports (backdrop-filter: blur(10px)) {
		.backdrop-blur-sm {
			backdrop-filter: blur(4px);
		}
	}

	/* Button hover effects */
	.group:hover .absolute.inset-0 {
		opacity: 1;
	}

	/* Enhanced glow effects for orbs */
	.bg-gradient-to-r.blur-2xl {
		animation: glow-pulse 3s ease-in-out infinite alternate;
	}

	@keyframes glow-pulse {
		0% {
			opacity: 0.4;
			filter: blur(2rem);
		}
		100% {
			opacity: 0.7;
			filter: blur(1.5rem);
		}
	}
</style>
