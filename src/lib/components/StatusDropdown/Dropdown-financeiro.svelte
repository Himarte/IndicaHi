<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import type { LeadFinanceiro } from '$lib/types/financeiro';
	import { getStatusPorCargo } from '$lib/components/StatusDropdown/statusPorCargo';
	import { createEventDispatcher } from 'svelte';

	export let lead: LeadFinanceiro;
	export let cargo: string;

	const dispatch = createEventDispatcher<{ statusChange: string }>();

	function handleStatusChange(value: any) {
		if (value && value.value) {
			dispatch('statusChange', value.value);
		}
	}

	$: status = getStatusPorCargo(cargo);
</script>

<div class="flex min-w-full gap-2">
	<input type="hidden" name="id" value={lead.id} />
	<Select.Root portal={null} onSelectedChange={handleStatusChange}>
		<Select.Trigger class="w-full border border-stone-700">
			<Select.Value placeholder="Alterar Status" />
		</Select.Trigger>
		<Select.Content class="border border-stone-700">
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
</div>
