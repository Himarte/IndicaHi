<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Textarea } from '../ui/textarea';

	interface Props {
		motivo?: string;
		open?: boolean;
		leadId?: string;
		onsuccess?: (event: { message: string; newStatus: string }) => void;
		onerror?: (event: { message: string }) => void;
	}

	let {
		motivo = $bindable(''),
		open = $bindable(false),
		leadId = '',
		onsuccess,
		onerror
	}: Props = $props();

	// Enviar os dados diretamente ao servidor ao confirmar
	const handleConfirm = async () => {
		try {
			const formData = new FormData();
			formData.append('id', leadId);
			formData.append('status', 'Cancelado');
			formData.append('motivo', motivo);

			const response = await fetch('?/updateStatus', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				const result = await response.json();
				onsuccess?.({
					message: 'Lead cancelado com sucesso',
					newStatus: 'Cancelado'
				});
				await invalidateAll();
			} else {
				const error = await response.json();
				onerror?.({ message: error.message || 'Erro ao cancelar lead' });
			}
		} catch (err) {
			console.error('Erro ao confirmar o cancelamento:', err);
			onerror?.({ message: 'Erro ao confirmar o cancelamento' });
		} finally {
			open = false;
		}
	};

	const handleCancel = () => {
		open = false;
	};
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content class="border-border">
		<AlertDialog.Header>
			<AlertDialog.Title class="text-lg font-bold text-amber-400"
				>Informe o motivo do cancelamento</AlertDialog.Title
			>
			<AlertDialog.Description>
				<Textarea
					class="border-border resize-none focus-visible:ring-0"
					rows={4}
					id="motivo"
					name="motivo"
					placeholder="Digite o motivo do cancelamento"
					bind:value={motivo}
				/>
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>
				<Button variant="ghost" onclick={handleCancel}>Cancelar</Button>
			</AlertDialog.Cancel>
			<Button variant="destructive" onclick={handleConfirm} disabled={!motivo}>Confirmar</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
