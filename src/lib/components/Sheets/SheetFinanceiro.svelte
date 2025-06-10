<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import type { LeadFinanceiro } from '$lib/types/financeiro';
	import Dropdown from '$lib/components/StatusDropdown/Dropdown-financeiro.svelte';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { formatarCPF, formatarTelefone, formatarCNPJ } from '$lib/uteis/masks';
	import Separator from '../ui/separator/separator.svelte';
	import BotaoBaixar from './BotaoBaixarFinanceiro.svelte';
	import { onMount } from 'svelte';

	export let lead: LeadFinanceiro;
	export let cargo: string;

	if (lead.status === 'Pago') {
		// fazer um onmout para pegar o comprovante para colocar um #await no botaoBaixar e passar o comprovante para o botaoBaixar
		onMount(async () => {
			await fetch(`/api/indicacoes/financeiro/${lead.id}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});
		});
	}

	let isOpen = false;
	let isSubmitting = false;
	let formEl: HTMLFormElement;
	let selectedStatus = '';

	const handleSubmit = () => {
		return async ({ formData, cancel }: { formData: FormData; cancel: () => void }) => {
			isSubmitting = true;

			// Obter o status do formulário
			const status = formData.get('status') as string;
			const comprovante = formData.get('comprovante') as File;

			// Só exige comprovante se o status não for "Cancelado"
			if (status !== 'Cancelado' && (!comprovante || comprovante.size === 0)) {
				toast.error('Por favor, anexe um comprovante');
				isSubmitting = false;
				cancel();
				return;
			}

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return async ({ result, update }: { result: any; update: () => Promise<void> }) => {
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
				isOpen = false;
				await update();
			};
		};
	};
</script>

<Sheet.Root bind:open={isOpen}>
	<Sheet.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="outline"
				class="w-full border border-gray-700/30 bg-zinc-900/40 text-green-400  hover:bg-zinc-900 {cargo ===
				'Financeiro'
					? 'text-orange-400 '
					: 'text-green-400 '}"
			>
				{cargo === 'Financeiro' ? 'Realizar Pagamento' : 'Visualizar Pagamento'}
			</Button>
		{/snippet}
	</Sheet.Trigger>

	<Sheet.Content side="right" class="border-border">
		<Sheet.Header>
			<Sheet.Title class="text-orange-400">
				{cargo === 'Financeiro' ? 'Informações do Vendedor' : 'Informações do Cliente'}
			</Sheet.Title>
			<Sheet.Description>
				Preencha os dados e anexe o comprovante para atualizar o status
			</Sheet.Description>
		</Sheet.Header>

		<form
			bind:this={formEl}
			action="?/updateStatus"
			method="POST"
			class="grid h-full py-5"
			enctype="multipart/form-data"
			use:enhance={handleSubmit()}
		>
			<div class="flex flex-col gap-4">
				<input type="hidden" name="id" value={lead.id} />
				<div class="flex flex-col items-start gap-2">
					<Label for="vendedor" class="text-right text-orange-400">Vendedor:</Label>
					<Input
						id="vendedor"
						name="vendedor"
						value={lead.vendedor ? lead.vendedor.nome : 'Nenhum vendedor informado'}
						class="col-span-3"
						readonly
					/>
				</div>
				<div class="flex flex-col items-start gap-2">
					<Label for="cpf" class="text-right text-orange-400">ID do vendedor:</Label>
					<Input
						id="cpf"
						name="cpf"
						value={lead.vendedor ? lead.vendedor.id : 'Nenhum ID informado'}
						class="col-span-3"
						readonly
					/>
				</div>

				<div class="flex flex-col items-start gap-2">
					<Label for="telefone" class="text-right text-orange-400">Telefone do vendedor:</Label>
					<Input
						id="telefone"
						name="telefone"
						value={lead.vendedor
							? lead.vendedor.telefone
								? formatarTelefone(lead.vendedor.telefone)
								: 'Nenhum telefone informado'
							: 'Nenhum vendedor informado'}
						class="col-span-3"
						readonly
					/>
				</div>

				<div class="flex flex-col items-start gap-2">
					<Label for="pixType" class="text-right text-orange-400	">
						Chave PIX: ({lead.vendedor?.pixType === 'cpf'
							? 'CPF'
							: lead.vendedor?.pixType === 'cnpj'
								? 'CNPJ'
								: lead.vendedor?.pixType === 'telefone'
									? 'Telefone'
									: 'E-mail'})
					</Label>
					<Input
						id="pixType"
						name="pixType"
						value={lead.vendedor
							? lead.vendedor.pixCode
								? lead.vendedor.pixType === 'cpf'
									? formatarCPF(lead.vendedor.pixCode)
									: lead.vendedor.pixType === 'cnpj'
										? formatarCNPJ(lead.vendedor.pixCode)
										: lead.vendedor.pixType === 'telefone'
											? formatarTelefone(lead.vendedor.pixCode)
											: lead.vendedor.pixCode
								: 'Não cadastrado'
							: 'Não cadastrado'}
						class="col-span-3"
						readonly
					/>
				</div>
				<Separator class="mt-4 mb-3" />
				<div class="flex flex-col items-start gap-2">
					<Label for="status" class="text-right text-orange-400		">Alterar status:</Label>
					<Dropdown {lead} {cargo} onstatusChange={(value) => (selectedStatus = value)} />
				</div>

				<div class=" flex flex-col items-start gap-2">
					<Label for="comprovante" class="text-right text-orange-400">
						{selectedStatus === 'Cancelado'
							? 'Anexar comprovante (opcional):'
							: 'Anexar comprovante:'}
					</Label>
					<input
						type="file"
						id="comprovante"
						name="comprovante"
						class=" bg-border focus:ring-opacity-40 block w-full rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-200 file:rounded-full file:border-none file:bg-gray-200 file:px-4 file:py-1 file:text-sm file:text-gray-700 focus:border-blue-400 focus:ring focus:ring-blue-300 focus:outline-none"
						accept=".jpg,.jpeg,.png,.pdf,.webp"
					/>
				</div>
			</div>
			{#if lead.status === 'Pago'}
				<div class="flex w-full justify-center">
					<BotaoBaixar {lead} />
				</div>
			{/if}
			<Sheet.Footer>
				<div class="flex w-full justify-end gap-2">
					<Sheet.Close>
						{#snippet child({ props })}
							<Button {...props} variant="outline" type="button">Cancelar</Button>
						{/snippet}
					</Sheet.Close>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? 'Salvando...' : 'Salvar'}
					</Button>
				</div>
			</Sheet.Footer>
		</form>
	</Sheet.Content>
</Sheet.Root>
