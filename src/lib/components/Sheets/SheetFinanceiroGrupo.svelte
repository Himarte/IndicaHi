<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Accordion from '$lib/components/ui/accordion';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { formatarTelefone } from '$lib/uteis/masks';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea';
	import { createEventDispatcher } from 'svelte';
	import {
		Clock,
		CheckCircle,
		User,
		Phone,
		CreditCard,
		Users,
		DollarSign,
		FileText,
		Gift,
		X
	} from 'lucide-svelte';

	interface GrupoFinanceiro {
		promoCode: string;
		vendedor: any;
		clientes: any[];
		valorTotal: number;
		bonusIndicacaoResgatado: number;
		criadoEm: string | null;
		atendidoEm: string | null;
		pagoEm: string | null;
	}

	export let grupo: GrupoFinanceiro;
	export let cargo: string;
	export let status: 'Aguardando Pagamento' | 'Pago';

	const dispatch = createEventDispatcher();

	let isOpen = false;
	let isSubmitting = false;
	let formEl: HTMLFormElement;
	let selectedStatus = '';

	// Calcula valor total final (planos + bônus) - correto é somar, não subtrair
	$: valorTotalFinal = grupo.valorTotal + grupo.bonusIndicacaoResgatado;

	function getStatusIcon(status: string) {
		if (status === 'Aguardando Pagamento') return Clock;
		if (status === 'Pago') return CheckCircle;
		if (status === 'Cancelado') return X;
		return Clock;
	}

	function getStatusColor(status: string) {
		if (status === 'Aguardando Pagamento') {
			return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
		}
		if (status === 'Pago') {
			return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
		}
		if (status === 'Cancelado') {
			return 'text-red-400 bg-red-400/10 border-red-400/20';
		}
		return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
	}

	const handleSubmit = () => {
		return async ({ formData, cancel }: { formData: FormData; cancel: () => void }) => {
			isSubmitting = true;

			const statusAlteracao = formData.get('status') as string;
			const comprovante = formData.get('comprovante') as File;

			console.log('Frontend - dados enviados:', {
				promoCode: formData.get('promoCode'),
				status: statusAlteracao,
				valorTotal: formData.get('valorTotal'),
				vendedorNome: formData.get('vendedorNome'),
				quantidadeClientes: formData.get('quantidadeClientes')
			});

			// Não cancelar aqui - deixar as validações para o servidor
			// As validações do frontend serão feitas apenas para UX, mas não bloqueiam o envio

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return async ({ result, update }: { result: any; update: () => Promise<void> }) => {
				isSubmitting = false;

				if (result.type === 'error') {
					toast.error(result.error.message || 'Erro ao processar pagamento do grupo');
					return;
				}

				if (result.type === 'failure') {
					toast.error(result.data?.message || 'Falha ao processar pagamento do grupo');
					return;
				}

				toast.success(`Pagamento do grupo "${grupo.promoCode}" processado com sucesso!`);
				formEl.reset();
				isOpen = false;
				dispatch('grupoAtualizado');
				await update();
			};
		};
	};
</script>

<Sheet.Root bind:open={isOpen}>
	<Sheet.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="outline"
			class="w-full  border border-zinc-700/50 bg-zinc-900/60 backdrop-blur-sm transition-all duration-200 hover:border-zinc-600/50 hover:bg-zinc-800/80 {status ===
			'Aguardando Pagamento'
				? 'text-orange-400 hover:text-orange-300'
				: 'text-emerald-400 hover:text-emerald-300'}"
		>
			<div class="flex items-center gap-2">
				{#if status === 'Aguardando Pagamento'}
					<Clock class="h-4 w-4" />
				{:else}
					<CheckCircle class="h-4 w-4" />
				{/if}
				{status === 'Aguardando Pagamento'
					? cargo === 'Financeiro'
						? 'Processar Pagamento'
						: 'Ver Detalhes'
					: 'Pagamento Realizado'}
			</div>
		</Button>
	</Sheet.Trigger>

	<Sheet.Content
		side="right"
		class="min-w-[600px] border-zinc-800/50 bg-zinc-950 backdrop-blur-xl "
	>
		<Sheet.Header class="space-y-4 pb-6">
			<div class="flex items-center justify-between">
				<Sheet.Title class="flex items-center gap-2 text-2xl font-bold text-zinc-100">
					<FileText class="h-6 w-6 text-amber-400" />
					Grupo: {grupo.promoCode}
				</Sheet.Title>
				<Badge class="{getStatusColor(status)} font-medium">
					<div class="flex items-center gap-1">
						<svelte:component this={getStatusIcon(status)} class="h-4 w-4" />
						{status}
					</div>
				</Badge>
			</div>
			<Sheet.Description class="text-base text-zinc-400">
				{status === 'Aguardando Pagamento'
					? 'Processe o pagamento para todos os clientes deste grupo'
					: 'Informações do pagamento realizado'}
			</Sheet.Description>
		</Sheet.Header>

		<div
			class="h-[calc(100vh-200px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-zinc-900/50 scrollbar-thumb-zinc-800/50"
		>
			<div class="space-y-4">
				<!-- Informações do Vendedor -->
				<Card.Root class="border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm">
					<Card.Header class="pb-4">
						<Card.Title class="flex items-center gap-2 text-lg text-amber-400">
							<User class="h-5 w-5" />
							Informações do Vendedor
						</Card.Title>
					</Card.Header>
					<Card.Content class="space-y-4">
						<div class="grid grid-cols-2 gap-4">
							<div class="space-y-2">
								<Label class="text-base font-medium text-zinc-400">Nome:</Label>
								<div
									class="rounded-lg bg-zinc-800/50 px-3 py-2 text-base font-medium text-zinc-100"
								>
									{grupo.vendedor?.nome || 'Não informado'}
								</div>
							</div>
							<div class="space-y-2">
								<Label class="text-base font-medium text-zinc-400">Telefone:</Label>
								<div class="rounded-lg bg-zinc-800/50 px-3 py-2 text-base text-zinc-100">
									{grupo.vendedor?.telefone
										? formatarTelefone(grupo.vendedor.telefone)
										: 'Não informado'}
								</div>
							</div>
						</div>

						{#if grupo.vendedor?.pixCode}
							<div class="space-y-2">
								<Label class="text-base font-medium text-zinc-400">
									Chave PIX ({grupo.vendedor.pixType?.toUpperCase()}):
								</Label>
								<div
									class="break-all rounded-lg border border-zinc-700/50 bg-zinc-800/70 px-3 py-2 font-mono text-base text-zinc-100"
								>
									{grupo.vendedor.pixCode}
								</div>
							</div>
						{/if}
					</Card.Content>
				</Card.Root>

				<!-- Resumo Financeiro -->
				<form
					id="form-{grupo.promoCode}"
					bind:this={formEl}
					method="POST"
					action="?/updateStatusGrupo"
					class="space-y-2"
					enctype="multipart/form-data"
					use:enhance={handleSubmit()}
				>
					<!-- Dados ocultos do grupo -->
					<input type="hidden" name="promoCode" value={grupo.promoCode} />
					<input type="hidden" name="valorTotal" value={grupo.valorTotal} />
					<input
						type="hidden"
						name="bonusIndicacaoResgatado"
						value={grupo.bonusIndicacaoResgatado}
					/>
					<input type="hidden" name="valorTotalFinal" value={valorTotalFinal} />
					<input type="hidden" name="criadoEm" value={grupo.criadoEm || ''} />
					<input type="hidden" name="atendidoEm" value={grupo.atendidoEm || ''} />
					<input type="hidden" name="pagoEm" value={grupo.pagoEm || ''} />

					<!-- Dados do vendedor -->
					<input type="hidden" name="vendedorNome" value={grupo.vendedor?.nome || ''} />
					<input type="hidden" name="vendedorTelefone" value={grupo.vendedor?.telefone || ''} />
					<input type="hidden" name="vendedorPixCode" value={grupo.vendedor?.pixCode || ''} />
					<input type="hidden" name="vendedorPixType" value={grupo.vendedor?.pixType || ''} />

					<!-- Dados dos clientes (stringified) -->
					<input type="hidden" name="clientesData" value={JSON.stringify(grupo.clientes)} />
					<input type="hidden" name="quantidadeClientes" value={grupo.clientes.length} />

					<Card.Root
						class="border-emerald-800/30 bg-gradient-to-br from-emerald-900/20 to-zinc-900/50 backdrop-blur-sm"
					>
						<Card.Header class="pb-4">
							<Card.Title class="flex items-center gap-2 text-lg text-emerald-400">
								<DollarSign class="h-5 w-5" />
								Resumo do Pagamento
							</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="flex items-center justify-between">
								<span class="text-zinc-400">Valor dos Planos:</span>
								<span class="text-lg font-semibold text-zinc-100"
									>R$ {grupo.valorTotal.toFixed(2)}</span
								>
							</div>

							{#if grupo.bonusIndicacaoResgatado > 0}
								<div class="flex items-center justify-between">
									<span class="flex items-center gap-1 text-amber-400">
										<Gift class="h-4 w-4" />
										Bônus Resgatado:
									</span>
									<span class="text-lg font-semibold text-amber-400">
										+R$ {grupo.bonusIndicacaoResgatado.toFixed(2)}
									</span>
								</div>
							{/if}

							<div
								class="mt-1 flex items-center justify-between rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-4 py-2"
							>
								<span class="text-xl font-bold text-emerald-400">TOTAL:</span>
								<span class="text-2xl font-bold text-emerald-400"
									>R$ {valorTotalFinal.toFixed(2)}</span
								>
							</div>
						</Card.Content>
					</Card.Root>

					<!-- Form de Ação -->
					{#if status === 'Aguardando Pagamento' && cargo === 'Financeiro'}
						<Card.Root class="border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm">
							<Card.Header class="pb-2">
								<Card.Title class="text-lg text-amber-400">Processar Pagamento</Card.Title>
							</Card.Header>
							<Card.Content>
								<div class="space-y-2">
									<div class="space-y-2">
										<Label for="status" class="font-medium text-zinc-300"
											>Alterar Status do Grupo:</Label
										>
										<Select.Root required>
											<Select.Trigger
												class="w-full rounded-lg border border-zinc-700/50 bg-zinc-800/50 p-2 text-sm text-zinc-100 transition-colors focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50"
											>
												<Select.Value placeholder="Selecione uma ação" />
											</Select.Trigger>
											<Select.Content class="border border-zinc-700/50 ">
												<Select.Item
													value="Pago"
													class="flex items-center gap-2"
													on:click={() => (selectedStatus = 'Pago')}
												>
													<CheckCircle class="h-4 w-4 text-emerald-400" />
													Marcar como Pago
												</Select.Item>
												<Select.Item
													value="Cancelado"
													class="flex items-center gap-2"
													on:click={() => (selectedStatus = 'Cancelado')}
												>
													<X class="h-4 w-4 text-red-400" />
													Cancelar Grupo
												</Select.Item>
											</Select.Content>
											<input type="hidden" name="status" bind:value={selectedStatus} />
										</Select.Root>
									</div>

									<!-- Campo de comprovante apenas para pagamento -->
									{#if selectedStatus === 'Pago'}
										<div class="space-y-2">
											<Label for="comprovante" class="font-medium text-zinc-300">
												Comprovante do Pagamento: <span class="text-red-400">*</span>
											</Label>
											<input
												type="file"
												id="comprovante"
												name="comprovante"
												required
												class="block w-full rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 py-3 text-sm text-zinc-200 transition-colors file:mr-4 file:rounded-full file:border-none file:bg-amber-500 file:px-4 file:py-2 file:text-sm file:text-white file:hover:bg-amber-600"
												accept=".jpg,.jpeg,.png,.pdf,.webp"
											/>
											<p class="text-xs text-zinc-500">
												Formatos aceitos: JPG, PNG, WEBP, PDF (máx. 5MB)
											</p>
										</div>
									{/if}

									<!-- Campo de motivo apenas para cancelamento -->
									{#if selectedStatus === 'Cancelado'}
										<div class="space-y-2">
											<Label for="motivo" class="font-medium text-zinc-300">
												Motivo do Cancelamento: <span class="text-red-400">*</span>
											</Label>
											<Textarea
												id="motivo"
												name="motivo"
												placeholder="Descreva o motivo do cancelamento do grupo..."
												required
												rows={4}
												class="resize-none rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-red-400/50 focus:ring-1 focus:ring-red-400/50"
											/>
											<p class="text-xs text-zinc-500">
												Este motivo será aplicado a todos os leads do grupo
											</p>
										</div>
									{/if}
								</div>
							</Card.Content>
						</Card.Root>
					{/if}
				</form>
			</div>
		</div>

		<Sheet.Footer class="border-t border-zinc-800/50 pt-6">
			<div class="flex w-full justify-end gap-3">
				<Sheet.Close asChild let:builder>
					<Button
						builders={[builder]}
						variant="outline"
						class="border-zinc-700/50 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50 hover:text-zinc-100"
					>
						Fechar
					</Button>
				</Sheet.Close>

				{#if status === 'Aguardando Pagamento' && cargo === 'Financeiro'}
					<Button
						type="submit"
						disabled={isSubmitting || !selectedStatus}
						form="form-{grupo.promoCode}"
						class="bg-gradient-to-r from-amber-500 to-amber-600 font-medium text-white shadow-lg transition-all duration-200 hover:from-amber-600 hover:to-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isSubmitting ? 'Processando...' : 'Processar'}
					</Button>
				{/if}
			</div>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
