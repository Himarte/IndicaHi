<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Textarea } from './ui/textarea';
	import { enhance } from '$app/forms';
	import { Skeleton } from './ui/skeleton';
	import { FileText, AlertCircle } from '@lucide/svelte';

	export let leadId: string;
	let motivo = '';
	let error = '';
	let loading = true;
	let isOpen = false;
	let formEl: HTMLFormElement;
	let loadedId = '';

	// Função para buscar o motivo quando o popover é aberto
	function onPopoverOpen(open: boolean) {
		if (open && !isOpen) {
			isOpen = true;

			// Só carrega novamente se for um leadId diferente
			if (loadedId !== leadId) {
				loading = true;
				motivo = '';
				error = '';
				loadedId = leadId;

				// Submete o formulário automaticamente quando o popover abre
				setTimeout(() => {
					if (formEl) {
						formEl.requestSubmit();
					}
				}, 50);
			}
		} else if (!open) {
			isOpen = false;
		}
	}

	// Essa função é executada ao submeter o formulário
	const enhanceForm = () => {
		loading = true;

		return async ({ result }: { result: { type: string; data?: Record<string, any> } }) => {
			loading = false;

			if (result.type === 'success' && result.data) {
				motivo = result.data.motivo || 'Nenhum motivo registrado';
			} else {
				error = 'Erro ao carregar o motivo';
			}
		};
	};
</script>

<Popover.Root onOpenChange={onPopoverOpen}>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="ghost"
				size="sm"
				class="group relative flex items-center gap-2 rounded-md border border-zinc-700/50 bg-zinc-800/50 px-3 py-2 text-xs font-medium text-zinc-300 transition-all duration-300 hover:border-red-400/50 hover:bg-red-500/10 hover:text-red-400 hover:shadow-lg hover:shadow-red-500/20"
			>
				{#if loading && isOpen}
					<div class="animate-spin">
						<AlertCircle size={16} />
					</div>
					<span>Carregando...</span>
				{:else}
					<FileText size={16} class="transition-transform duration-300 group-hover:scale-110" />
					<span>Ver Motivo</span>
				{/if}
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="border-border w-80 bg-zinc-900 pt-2">
		<div class="flex flex-col items-center justify-center gap-2">
			<p class="text-sm font-bold text-red-400">Motivo do Cancelamento</p>

			<form
				bind:this={formEl}
				method="POST"
				action="/api/leads/motivo-cancelamento?/fetchMotivo"
				use:enhance={enhanceForm}
				class="w-full"
			>
				<input type="hidden" name="leadId" value={leadId} />

				{#if loading}
					<Skeleton class="h-20 w-full" />
				{:else if error}
					<p class="text-sm text-red-500">{error}</p>
				{:else if motivo}
					<Textarea
						class="min-h-[100px] w-full resize-none border-red-400 focus-visible:ring-0"
						value={motivo}
						readonly
					/>
				{:else}
					<p class="text-sm text-gray-500">Nenhum motivo registrado</p>
				{/if}
			</form>
		</div>
	</Popover.Content>
</Popover.Root>
