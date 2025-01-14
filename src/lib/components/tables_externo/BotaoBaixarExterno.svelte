<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Download } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import { onMount } from 'svelte';
	import type { LeadsSchema } from '$lib/server/database/schema';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

  export let lead: LeadsSchema;
  let isLoading = false;
  let comprovante: string | null = null;

  onMount(async () => {
    try {
      const response = await fetch(`/api/indicacoes/externo/comprovante/${lead.id}`, {
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

<Tooltip.Root>
	<Tooltip.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="ghost"
			class="absolute bottom-2 right-2 flex items-center text-orange-400"
		>
			<Download />
		</Button>
	</Tooltip.Trigger>
	<Tooltip.Content side="bottom">
		<p>Baixar Comprovante</p>
	</Tooltip.Content>
</Tooltip.Root>
