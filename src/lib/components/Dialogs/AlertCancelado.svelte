<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Textarea } from '../ui/textarea';
	import { createEventDispatcher } from 'svelte';

	export let motivo = '';
	export let open = false;
	export let leadId = ''; // O ID do lead que será atualizado
	const dispatch = createEventDispatcher();

	// Enviar os dados diretamente ao servidor ao confirmar
	const handleConfirm = async () => {
		try {
			const formData = new FormData();
			formData.append('id', leadId);
			formData.append('status', 'Cancelado');
			formData.append('motivo', motivo);

			const response = await fetch('?/updateStatus', {
				method: 'POST',
				body: formData // Corrigido aqui
			});

			if (response.ok) {
				const result = await response.json();
				dispatch('success', {
					message: 'Lead cancelado com sucesso',
					newStatus: 'Cancelado'
				});
				await invalidateAll();
			} else {
				const error = await response.json();
				dispatch('error', { message: error.message || 'Erro ao cancelar lead' });
			}
		} catch (err) {
			console.error('Erro ao confirmar o cancelamento:', err);
			dispatch('error', { message: 'Erro ao confirmar o cancelamento' });
		} finally {
			open = false;
		}
	};

	const handleCancel = () => {
		open = false;
	};
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Informe o motivo do cancelamento</AlertDialog.Title>
			<AlertDialog.Description>
				<Textarea
					id="motivo"
					name="motivo"
					placeholder="Digite o motivo do cancelamento"
					bind:value={motivo}
				/>
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>
				<Button variant="ghost" on:click={handleCancel}>Cancelar</Button>
			</AlertDialog.Cancel>
			<Button variant="destructive" on:click={handleConfirm} disabled={!motivo}>Confirmar</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
