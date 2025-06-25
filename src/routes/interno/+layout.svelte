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

	// Loading específico para navegação entre páginas internas
	$effect(() => {
		if ($navigating) {
			// Só mostra loading se demorar mais que 250ms (evita flashes)
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

<!-- Loading específico para interno -->
{#if showLoading}
	<div
		class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
		transition:fade={{ duration: 150 }}
		role="status"
		aria-label="Carregando..."
	>
		<div class="flex flex-col items-center gap-4">
			<div class="relative">
				<div
					class="h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-blue-500"
				></div>
				<div
					class="absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-b-blue-400 [animation-direction:reverse] [animation-duration:1.3s]"
				></div>
			</div>
			<p class="text-sm font-medium text-white/90">Carregando leads...</p>
		</div>
	</div>
{/if}

{@render children?.({ userData: data.user })}
