<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	export let status: string;
	const leads = [
		{ value: 'Sendo Atendido', label: 'Sendo Atendido' },
		{ value: 'Finalizado', label: 'Finalizado' }
	];
</script>

<Select.Root>
	<Select.Trigger class="w-full border-secondary">
		<Select.Value placeholder={status} />
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			{#each leads as lead}
				<Select.Item value={lead.value} label={lead.label}>{lead.label}</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
	<Select.Input name="status" />
</Select.Root>
