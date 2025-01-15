<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import type { LeadsSchema } from '$lib/server/database/schema';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { getStatusPorCargo } from './statusPorCargo';

	export let lead: LeadsSchema;
	export let cargo: string;

	// Obtém as opções de status baseado no cargo
	$: statusOptions = getStatusPorCargo(cargo);

	// Filtra as opções de status com base nas regras de negócio
	$: filteredStatusOptions = statusOptions.filter((option) => {
		// Não mostrar o status atual do lead
		if (option.value === lead.status) return false;

		// Para leads pendentes, mostrar apenas "Sendo Atendido" e "Cancelado"
		if (lead.status === 'Pendente') {
			return option.value === 'Sendo Atendido' || option.value === 'Cancelado';
		}

		// Para leads em atendimento sem código promocional
		if (lead.status === 'Sendo Atendido' && lead.promoCode === null) {
			return (
				option.value === 'Finalizado' || option.value === 'Cancelado' || option.value === 'Pendente'
			);
		}

		// Para leads com código promocional e sendo atendido, mostrar apenas "Aguardando Pagamento", "Cancelado" e "Pendente"
		if (lead.promoCode && lead.status === 'Sendo Atendido') {
			return (
				option.value === 'Aguardando Pagamento' ||
				option.value === 'Cancelado' ||
				option.value === 'Pendente'
			);
		}

		return true;
	});

	// Handler para o formulário
	const handleSubmit = () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return async ({ result, update }: { result: any; update: any }) => {
			if (result.type === 'failure') {
				toast.error('Erro ao atualizar status');
			} else if (result.type === 'success') {
				toast.success('Status atualizado com sucesso');
			}
			await update();
		};
	};
</script>

<form
	action="?/updateStatus"
	method="POST"
	class="flex min-w-full gap-2"
	use:enhance={handleSubmit}
>
	<input type="hidden" name="id" value={lead.id} />

	<Select.Root portal={null}>
		<Select.Trigger class="w-full border bg-background text-orange-400 focus:ring-border">
			<Select.Value placeholder="Alterar Status" />
		</Select.Trigger>

		<Select.Content class="border border-stone-700">
			<Select.Group>
				<Select.Label>Selecione um status</Select.Label>
				<Select.Separator />

				{#each filteredStatusOptions as option}
					<Select.Item value={option.value} label={option.label}>
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
	>
		Salvar
	</Button>
</form>
