<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import type { LeadsSchema } from '$lib/server/database/schema';
	import Button from './ui/button/button.svelte';
	import Badge from './ui/badge/badge.svelte';

	export let lead: LeadsSchema;

	async function updateStatus(newStatus: string) {
		try {
			const formData = new FormData();
			formData.append('id', lead.id);
			formData.append('status', newStatus);

			const response = await fetch('?/updateStatus', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (response.ok) {
				toast.success(result.message);
				await invalidateAll();
			} else {
				toast.error(result.message);
			}
		} catch (error) {
			toast.error('Erro ao atualizar status');
			console.error(error);
		}
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button
			variant="outline"
			size="sm"
			class="bg-zinc-900 text-xs hover:bg-zinc-950"
			builders={[builder]}>Mudar Status</Button
		>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-44 border-[0.02rem] border-border">
		<DropdownMenu.Label>Status</DropdownMenu.Label>
		<DropdownMenu.Separator />

		<DropdownMenu.RadioGroup class="flex w-full flex-col items-start justify-center">
			<DropdownMenu.RadioItem
				value="Sendo Atendido"
				class="flex w-full items-center justify-center"
				on:click={() => updateStatus('Sendo Atendido')}
			>
				<Badge class="w-28 bg-red-400 hover:bg-red-400">Pendente</Badge>
			</DropdownMenu.RadioItem>
			<DropdownMenu.RadioItem
				value="Sendo Atendido"
				class="flex w-full items-center justify-center"
				on:click={() => updateStatus('Sendo Atendido')}
			>
				<Badge class="w-28 bg-blue-400 hover:bg-blue-400">Sendo Atendido</Badge>
			</DropdownMenu.RadioItem>
			<DropdownMenu.RadioItem
				value="Finalizado"
				class="flex w-full items-center justify-center"
				on:click={() => updateStatus('Finalizado')}
			>
				<Badge class="w-28 bg-green-400 hover:bg-green-400">Finalizado</Badge>
			</DropdownMenu.RadioItem>
			<DropdownMenu.RadioItem
				value="Sem Sucesso"
				class="flex w-full items-center justify-center"
				on:click={() => updateStatus('Sem Sucesso')}
			>
				<Badge class="w-28 bg-gray-400 hover:bg-gray-400">Cancelado</Badge>
			</DropdownMenu.RadioItem>
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>
