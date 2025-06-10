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

	interface Props {
		lead: LeadsSchema;
		cargo: string;
		hoverBorderColor: string;
	}

	let { lead, cargo, hoverBorderColor }: Props = $props();

	// Estado para o status selecionado no dropdown
	let selectedStatus = $state<string>('');

	// Obtém as opções de status baseado no cargo
	let statusOptions = $derived(getStatusPorCargo(cargo));

	// Filtra as opções de status com base nas regras de negócio
	let filteredStatusOptions = $derived(
		statusOptions.filter((option) => {
			if (option.value === lead.status) return false;
			if (lead.status === 'Pendente') {
				return option.value === 'Sendo Atendido' || option.value === 'Cancelado';
			}
			if (lead.status === 'Sendo Atendido' && lead.promoCode === null) {
				return (
					option.value === 'Finalizado' ||
					option.value === 'Cancelado' ||
					option.value === 'Pendente'
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
		})
	);

	// Modal de confirmação do cancelamento
	let motivoCancelamento = $state('');
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
			selectedStatus = ''; // Reset do dropdown
		} else {
			console.error('Status inválido recebido:', newStatus);
		}
	};

	// Handler para o formulário
	const handleSubmit: SubmitFunction = () => {
		// Validação antes de enviar
		if (!selectedStatus) {
			toast.error('Selecione um status antes de salvar');
			return;
		}

		return async ({ result, update }) => {
			if (result.type === 'failure') {
				toast.error('Erro ao atualizar status');
				console.error('Erro no servidor:', result.data?.message);
			} else if (result.type === 'success') {
				toast.success('Status atualizado com sucesso');

				// Atualiza o estado local com o novo status
				const newStatus = result.data?.newStatus || selectedStatus;
				if (newStatus) {
					updateLeadStatus(newStatus);
				}

				// Força uma atualização da página
				await update({ reset: false });

				// Recarrega os dados
				await invalidateAll();
			}
		};
	};

	// Função para lidar com mudança de status no dropdown
	const handleStatusChange = (value: string) => {
		selectedStatus = value;
		if (value === 'Cancelado') {
			showAlert.set(true); // Abre o modal de cancelamento
		}
	};

	// Lida com o sucesso do cancelamento no alert
	const handleAlertSuccess = async (event: { message: string; newStatus: string }) => {
		toast.success(event.message);
		updateLeadStatus(event.newStatus);
		await invalidateAll();
		goto('/interno'); // Força a navegação para a mesma página
	};

	// Lida com erros no alert
	const handleAlertError = (event: { message: string }) => {
		toast.error(event.message); // Mostra uma notificação de erro
	};

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
	onsuccess={handleAlertSuccess}
	onerror={handleAlertError}
/>

<!-- Dropdown com botão de salvar -->
<form
	action="?/updateStatus"
	method="POST"
	class="flex min-w-full gap-2"
	use:enhance={handleSubmit}
>
	<input type="hidden" name="id" value={lead.id} />
	<input type="hidden" name="status" value={selectedStatus} />
	<input type="hidden" name="motivo" value={motivoCancelamento} />

	<Select.Root type="single">
		<Select.Trigger class="bg-background focus:ring-border w-full border">
			<span data-slot="select-value" class="flex items-center gap-2">
				{#if selectedStatus}
					{@const selectedOption = filteredStatusOptions.find(opt => opt.value === selectedStatus)}
					{#if selectedOption}
						{@const IconComponent = selectedOption.icon}
						<IconComponent class="h-4 w-4" />
						{selectedOption.label}
					{/if}
				{:else}
					Alterar Status
				{/if}
			</span>
		</Select.Trigger>

		<Select.Content class="border border-stone-700">
			<Select.Group>
				<Select.Label>Selecione um status</Select.Label>
				<Select.Separator />

				{#each filteredStatusOptions as option (option.value)}
					{@const IconComponent = option.icon}
					<Select.Item value={option.value} onclick={() => handleStatusChange(option.value)}>
						<div class="flex items-center gap-2">
							<IconComponent class="h-4 w-4" />
							{option.label}
						</div>
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>

	<Button
		type="submit"
		variant="outline"
		size="default"
		class="!bg-background absolute right-2 -bottom-5 hover:cursor-pointer {hoverBorderColor}"
		disabled={!selectedStatus || ($showAlert && !motivoCancelamento)}
	>
		Salvar
	</Button>
</form>
