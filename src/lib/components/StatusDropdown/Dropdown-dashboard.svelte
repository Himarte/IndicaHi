<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import type { LeadsSchema } from '$lib/server/database/schema';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { getStatusPorCargo } from './statusPorCargo';
	import AlertCancelado from '$lib/components/Dialogs/AlertCancelado.svelte';
	import { writable } from 'svelte/store';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { goto, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';

	export let lead: LeadsSchema;
	export let cargo: string;

	// Obtém as opções de status baseado no cargo
	$: statusOptions = getStatusPorCargo(cargo);

	// Filtra as opções de status com base nas regras de negócio
	$: filteredStatusOptions = statusOptions.filter((option) => {
		if (option.value === lead.status) return false;
		if (lead.status === 'Pendente') {
			return option.value === 'Sendo Atendido' || option.value === 'Cancelado';
		}
		if (lead.status === 'Sendo Atendido' && lead.promoCode === null) {
			return (
				option.value === 'Finalizado' || option.value === 'Cancelado' || option.value === 'Pendente'
			);
		}
		if (lead.promoCode && lead.status === 'Sendo Atendido') {
			return (
				option.value === 'Aguardando Pagamento' ||
				option.value === 'Cancelado' ||
				option.value === 'Pendente'
			);
		}
		return true;
	});

	// Modal de confirmação do cancelamento
	let motivoCancelamento = '';
	const showAlert = writable(false);

	// Atualiza o status localmente após o cancelamento
	const updateLeadStatus = (newStatus: string) => {
		// Garantir que o newStatus é compatível com o tipo de status do lead
		if (
			newStatus === 'Pendente' ||
			newStatus === 'Sendo Atendido' ||
			newStatus === 'Finalizado' ||
			newStatus === 'Pago' ||
			newStatus === 'Cancelado' ||
			newStatus === 'Aguardando Pagamento'
		) {
			lead.status = newStatus; // Atualiza o status localmente
		} else {
			console.error('Status inválido recebido:', newStatus);
		}
	};

	// Handler para o formulário
	const handleSubmit: SubmitFunction = () => {
		return async ({ result, update }) => {
			if (result.type === 'failure') {
				toast.error('Erro ao atualizar status');
			} else if (result.type === 'success') {
				// Atualiza o estado local
				updateLeadStatus(result.data?.newStatus);
				// Força uma atualização da página
				await update({ reset: false });
				// Recarrega os dados
				await invalidateAll();
			}
		};
	};
	// Função para abrir o modal ao selecionar "Cancelado"
	const handleStatusChange = (selectedStatus: string) => {
		if (selectedStatus === 'Cancelado') {
			showAlert.set(true); // Abre o modal
		}
	};

	// Lida com o sucesso do cancelamento no alert
	const handleAlertSuccess = async (event: CustomEvent<{ message: string; newStatus: string }>) => {
		toast.success(event.detail.message);
		updateLeadStatus(event.detail.newStatus);
		await invalidateAll();
		goto('/interno'); // Força a navegação para a mesma página
	};

	// Lida com erros no alert
	const handleAlertError = (event: CustomEvent<{ message: string }>) => {
		toast.error(event.detail.message); // Mostra uma notificação de erro
	};

	async function atualizarDados() {
		await invalidateAll();
	}

	// Listener para eventos de atualização
	onMount(() => {
		return () => {
			// Cleanup se necessário
		};
	});
</script>

<!-- Componente AlertCancelado -->
<AlertCancelado
	bind:motivo={motivoCancelamento}
	bind:open={$showAlert}
	leadId={lead.id}
	on:success={handleAlertSuccess}
	on:error={handleAlertError}
/>

<!-- Dropdown com botão de salvar -->
<form
	action="?/updateStatus"
	method="POST"
	class="flex min-w-full gap-2"
	use:enhance={handleSubmit}
>
	<input type="hidden" name="id" value={lead.id} />
	<input type="hidden" name="motivo" value={motivoCancelamento} />

	<Select.Root portal={null}>
		<Select.Trigger class="w-full border bg-background text-orange-400 focus:ring-border">
			<Select.Value placeholder="Alterar Status" />
		</Select.Trigger>

		<Select.Content class="border border-stone-700">
			<Select.Group>
				<Select.Label>Selecione um status</Select.Label>
				<Select.Separator />

				{#each filteredStatusOptions as option}
					<Select.Item
						value={option.value}
						label={option.label}
						on:click={() => handleStatusChange(option.value)}
					>
						{option.label}
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>

		<Select.Input name="status" />
	</Select.Root>

	<Button
		type="submit"
		variant="outline"
		size="default"
		class="absolute -bottom-4 right-2 hover:border-stone-700"
		disabled={$showAlert && !motivoCancelamento}
	>
		Salvar
	</Button>
</form>
