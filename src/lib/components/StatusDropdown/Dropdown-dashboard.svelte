<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import type { LeadsSchema } from '$lib/server/database/schema';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { getStatusPorCargo } from '$lib/components/StatusDropdown/statusPorCargo';

	export let lead: LeadsSchema;
	export let cargo: string;

	$: status = getStatusPorCargo(cargo);
</script>

<form
	action="?/updateStatus"
	method="POST"
	class="flex min-w-full gap-2"
	use:enhance={() => {
		return async ({ result, update }) => {
			if (result.type === 'failure') {
				toast.error('Erro ao atualizar status');
			} else if (result.type === 'success') {
				toast.success('Status atualizado com sucesso');
			}
			await update();
		};
	}}
>
	<input type="hidden" name="id" value={lead.id} />
	<Select.Root portal={null}>
		<Select.Trigger class="w-full border border-stone-700">
			<Select.Value placeholder="Alterar Status" />
		</Select.Trigger>
		<Select.Content class=" border border-stone-700">
			<Select.Group>
				<Select.Label>Selecione um status</Select.Label>
				<Select.Separator />
				{#each status as status}
					{#if status.value !== lead.status}
						<Select.Item value={status.value} label={status.label}>
							{status.label}
						</Select.Item>
					{/if}
				{/each}
			</Select.Group>
		</Select.Content>
		<Select.Input name="status" />
	</Select.Root>
	<Button
		type="submit"
		variant="outline"
		size="sm"
		class="absolute -bottom-4 right-2 hover:border-stone-700">Salvar</Button
	>
</form>
