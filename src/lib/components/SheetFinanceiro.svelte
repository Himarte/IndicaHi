<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import type { LeadsSchema } from '$lib/server/database/schema';
	import Dropdown from '$lib/components/StatusDropdown/Dropdown-financeiro.svelte';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';

	export let lead: LeadsSchema;
	export let cargo: string;

	let isSubmitting = false;
	let formEl: HTMLFormElement;

	const handleSubmit = () => {
		return async ({ formData, cancel }: { formData: FormData; cancel: () => void }) => {
			isSubmitting = true;

			const comprovante = formData.get('comprovante') as File;
			if (!comprovante || comprovante.size === 0) {
				toast.error('Por favor, anexe um comprovante');
				isSubmitting = false;
				cancel();
				return;
			}

			return async ({ result }: { result: any }) => {
				isSubmitting = false;

				if (result.type === 'error') {
					toast.error(result.error.message || 'Erro ao atualizar informações');
					return;
				}

				if (result.type === 'failure') {
					toast.error(result.data?.message || 'Falha ao atualizar informações');
					return;
				}

				toast.success('Informações atualizadas com sucesso!');
				formEl.reset();
			};
		};
	};
</script>

<Sheet.Root>
	<Sheet.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline">Alterar informações</Button>
	</Sheet.Trigger>

	<Sheet.Content side="right">
		<Sheet.Header>
			<Sheet.Title>Alterar informações</Sheet.Title>
			<Sheet.Description>
				Preencha os dados e anexe o comprovante para atualizar o status
			</Sheet.Description>
		</Sheet.Header>

		<form
			bind:this={formEl}
			action="?/updateStatus"
			method="POST"
			class="grid gap-4 py-4"
			enctype="multipart/form-data"
			use:enhance={handleSubmit()}
		>
			<input type="hidden" name="id" value={lead.id} />

			<div class="flex flex-col items-start gap-4">
				<Label for="name" class="text-right">Nome</Label>
				<Input id="name" name="fullName" value={lead.fullName} class="col-span-3" readonly />
			</div>

			<div class="flex flex-col items-start gap-4">
				<Label for="criadoEm" class="text-right">Data de criação</Label>
				<Input id="criadoEm" name="criadoEm" value={lead.criadoEm} class="col-span-3" readonly />
			</div>

			<div class="flex flex-col items-start gap-4">
				<Label for="telefone" class="text-right">Telefone</Label>
				<Input id="telefone" name="telefone" value={lead.telefone} class="col-span-3" readonly />
			</div>

			<div class="flex flex-col items-start gap-4">
				<Label for="cpf" class="text-right">CPF</Label>
				<Input id="cpf" name="cpf" value={lead.cpf} class="col-span-3" readonly />
			</div>

			<div class="flex flex-col items-start gap-4">
				<Label for="status" class="text-right">Alterar status</Label>
				<Dropdown {lead} {cargo} />
			</div>

			<div class="flex flex-col items-start gap-4">
				<Label for="comprovante" class="text-right">Anexar comprovante</Label>
				<input
					type="file"
					id="comprovante"
					name="comprovante"
					class="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 placeholder-gray-400/70 file:rounded-full file:border-none file:bg-gray-200 file:px-4 file:py-1 file:text-sm file:text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
					accept=".jpg,.jpeg,.png,.pdf,.webp"
					required
				/>
			</div>

			<Sheet.Footer>
				<div class="flex w-full justify-end gap-4">
					<Sheet.Close asChild let:builder>
						<Button builders={[builder]} variant="outline" type="button">Cancelar</Button>
					</Sheet.Close>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? 'Salvando...' : 'Salvar'}
					</Button>
				</div>
			</Sheet.Footer>
		</form>
	</Sheet.Content>
</Sheet.Root>
