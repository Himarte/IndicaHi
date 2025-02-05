<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Download } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import type { LeadFinanceiro } from '$lib/types/financeiro';
  import { onMount } from 'svelte';

  export let lead: LeadFinanceiro;
  let isLoading = false;
  let comprovante: string | null = null;

  onMount(async () => {
    try {
      const response = await fetch(`/api/indicacoes/financeiro/comprovante/${lead.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Falha ao carregar comprovante');
      const data = await response.json();
      comprovante = data.comprovante;
    } catch (error) {
      console.error('Erro ao carregar comprovante:', error);
    }
  });

  async function handleDownload() {
    if (isLoading) return;

    try {
      isLoading = true;

      if (!comprovante) {
        toast.error('Comprovante não disponível');
        return;
      }

      const [, tipo, base64] = comprovante.match(/data:(.*);base64,(.*)/) || [];

      if (!tipo || !base64) {
        toast.error('Formato do comprovante inválido');
        return;
      }

      // Cria o blob e faz download
      const byteCharacters = atob(base64);
      const byteArray = new Uint8Array(byteCharacters.split('').map(char => char.charCodeAt(0)));
      const blob = new Blob([byteArray], { type: tipo });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `comprovante_${lead.fullName.replace(/\s+/g, '_')}.${tipo.split('/')[1]}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Download iniciado com sucesso!');
    } catch (error) {
      console.error('Erro ao baixar comprovante:', error);
      toast.error('Erro ao baixar o comprovante');
    } finally {
      isLoading = false;
    }
  }
</script>

<Button
	variant="ghost"
	class="flex items-center gap-2 text-orange-400 hover:bg-stone-900 hover:text-orange-400"
	on:click={handleDownload}
	disabled={isLoading}
>
	<Download size={18} />
	{isLoading ? 'Baixando...' : 'Baixar Comprovante'}
</Button>
