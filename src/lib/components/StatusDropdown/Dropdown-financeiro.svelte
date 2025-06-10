<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import type { LeadFinanceiro } from '$lib/types/financeiro';
	import { getStatusPorCargo } from '$lib/components/StatusDropdown/statusPorCargo';

	interface Props {
		lead: LeadFinanceiro;
		cargo: string;
		onstatusChange?: (value: string) => void;
	}

	let { lead, cargo, onstatusChange }: Props = $props();

	function handleStatusChange(value: string | string[] | undefined) {
		if (value) {
			const selectedValue = Array.isArray(value) ? value[0] : value;
			onstatusChange?.(selectedValue);
		}
	}

	let status = $derived(getStatusPorCargo(cargo));
</script>

<div class="flex min-w-full gap-2">
	<input type="hidden" name="id" value={lead.id} />
	<Select.Root type="single" onValueChange={handleStatusChange}>
		<Select.Trigger class="w-full border border-stone-700">
			<span data-slot="select-value">Alterar Status</span>
		</Select.Trigger>
		<Select.Content class="border border-stone-700">
			<Select.Group>
				<Select.Label>Selecione um status</Select.Label>
				<Select.Separator />
				{#each status as statusItem (statusItem.value)}
					{#if statusItem.value !== lead.status}
						<Select.Item value={statusItem.value}>
							{statusItem.label}
						</Select.Item>
					{/if}
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
</div>
