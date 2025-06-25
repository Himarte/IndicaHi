<script lang="ts">
	import { navigating } from '$app/stores';
	import { fade } from 'svelte/transition';
	import type { LayoutData } from './$types';

	interface Props {
		data: LayoutData;
		children?: import('svelte').Snippet<[any]>; // eslint-disable-line @typescript-eslint/no-explicit-any
	}

	let { children, data }: Props = $props();

	let showLoading = $state(false);
	let timeout: NodeJS.Timeout;

	// Loading específico para navegação entre páginas financeiro
	$effect(() => {
		if ($navigating) {
			// Só mostra loading se demorar mais que 200ms (evita flashes)
			timeout = setTimeout(() => {
				showLoading = true;
			}, 200);
		} else {
			clearTimeout(timeout);
			showLoading = false;
		}

		return () => clearTimeout(timeout);
	});
</script>

<!-- Loading específico para financeiro -->
{#if showLoading}
	<div
		class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm"
		transition:fade={{ duration: 150 }}
		role="status"
		aria-label="Processando..."
	>
		<div class="flex flex-col items-center gap-3">
			<div class="relative">
				<div
					class="h-11 w-11 animate-spin rounded-full border-4 border-transparent border-t-green-500"
				></div>
				<div
					class="absolute inset-0 h-11 w-11 animate-spin rounded-full border-4 border-transparent border-b-emerald-400 [animation-direction:reverse] [animation-duration:1.1s]"
				></div>
			</div>
			<p class="text-sm font-medium text-white/80">Processando pagamentos...</p>
		</div>
	</div>
{/if}

{@render children?.({ userData: data.user })}
