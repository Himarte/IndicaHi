<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Download, FileText } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';
	import type { LeadsSchema } from '$lib/server/database/schema';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	export let lead: LeadsSchema;
	let isLoading = false;
	let comprovante: string | null = null;
	let hasComprovante = false;

	onMount(async () => {
		try {
			const response = await fetch(`/api/indicacoes/dashboard/comprovante/${lead.id}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				console.warn('Comprovante não disponível para este lead');
				return;
			}

			const data = await response.json();
			comprovante = data.comprovante;
			hasComprovante = !!comprovante;
		} catch (error) {
			console.error('Erro ao carregar comprovante:', error);
			hasComprovante = false;
		}
	});

	async function handleDownload() {
		if (isLoading) return;

		try {
			isLoading = true;

			if (!comprovante) {
				toast.error('Comprovante não disponível para download');
				return;
			}

			const [, mimeType, base64Data] = comprovante.match(/data:(.*?);base64,(.*)/) || [];

			if (!mimeType || !base64Data) {
				toast.error('Formato do comprovante inválido');
				return;
			}

			// Converter base64 para Blob
			const byteCharacters = atob(base64Data);
			const byteArray = new Uint8Array(byteCharacters.split('').map((char) => char.charCodeAt(0)));
			const blob = new Blob([byteArray], { type: mimeType });

			// Determinar extensão do arquivo
			const extension = mimeType.includes('pdf')
				? 'pdf'
				: mimeType.includes('png')
					? 'png'
					: mimeType.includes('jpeg')
						? 'jpg'
						: mimeType.includes('webp')
							? 'webp'
							: 'jpg';

			// Criar e acionar download
			const url = URL.createObjectURL(blob);
			const downloadElement = document.createElement('a');
			downloadElement.href = url;
			downloadElement.download = `comprovante_${lead.fullName?.replace(/\s+/g, '_') || lead.id}_${new Date().toISOString().split('T')[0]}.${extension}`;

			document.body.appendChild(downloadElement);
			downloadElement.click();
			document.body.removeChild(downloadElement);

			// Limpar URL do objeto
			URL.revokeObjectURL(url);

			toast.success('Download realizado com sucesso!');
		} catch (error) {
			console.error('Erro ao baixar comprovante:', error);
			toast.error('Erro ao realizar download do comprovante');
		} finally {
			isLoading = false;
		}
	}
</script>

<Button
	variant="ghost"
	size="sm"
	class="group relative flex items-center gap-2 rounded-md border border-zinc-700/50 bg-zinc-800/50 px-3 py-2 text-xs font-medium text-zinc-300 transition-all duration-300 hover:border-amber-400/50 hover:bg-amber-500/10 hover:text-amber-400 hover:shadow-lg hover:shadow-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-zinc-700/50 disabled:hover:bg-zinc-800/50 disabled:hover:text-zinc-300"
	onclick={handleDownload}
	disabled={isLoading || !hasComprovante}
>
	{#if isLoading}
		<div class="animate-spin">
			<Download size={16} />
		</div>
		<span>Baixando...</span>
	{:else if hasComprovante}
		<Download size={16} class="transition-transform duration-300 group-hover:scale-110" />
		<span>Baixar Comprovante</span>
	{:else}
		<FileText size={16} class="text-zinc-500" />
		<span class="text-zinc-500">Sem Comprovante</span>
	{/if}
</Button>
