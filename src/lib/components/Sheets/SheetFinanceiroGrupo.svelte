<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
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
		DollarSign,
		FileText,
		Gift,
		X,
		Download
	} from '@lucide/svelte';

	interface Vendedor {
		nome?: string;
		telefone?: string;
		pixCode?: string;
		pixType?: string;
	}

	interface Cliente {
		id: string;
		nome?: string;
		telefone?: string;
	}

	interface GrupoFinanceiro {
		promoCode: string;
		vendedor: Vendedor | null;
		clientes: Cliente[];
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
	let isDownloading = false;

	// Calcula valor total final (planos + bônus) - correto é somar, não subtrair
	$: valorTotalFinal = grupo.valorTotal + grupo.bonusIndicacaoResgatado;

	// Função para baixar comprovante do grupo
	async function baixarComprovante() {
		isDownloading = true;
		try {
			const response = await fetch(
				`/api/indicacoes/financeiro/comprovante/grupo/${grupo.promoCode}`
			);

			if (!response.ok) {
				if (response.status === 404) {
					toast.error('Comprovante não encontrado para este grupo');
				} else {
					toast.error('Erro ao buscar comprovante do grupo');
				}
				return;
			}

			const data = await response.json();
			const comprovanteBase64 = data.comprovante;

			// Extrair tipo do arquivo e dados base64
			const [metadata, base64Data] = comprovanteBase64.split(',');
			const mimeType = metadata.match(/data:([^;]+)/)?.[1] || 'application/octet-stream';

			// Determinar extensão do arquivo
			const extensao = mimeType.includes('pdf')
				? 'pdf'
				: mimeType.includes('png')
					? 'png'
					: mimeType.includes('jpeg')
						? 'jpg'
						: mimeType.includes('webp')
							? 'webp'
							: 'bin';

			// Converter base64 para blob
			const byteCharacters = atob(base64Data);
			const byteNumbers = new Array(byteCharacters.length);
			for (let i = 0; i < byteCharacters.length; i++) {
				byteNumbers[i] = byteCharacters.charCodeAt(i);
			}
			const byteArray = new Uint8Array(byteNumbers);
			const blob = new Blob([byteArray], { type: mimeType });

			// Criar link de download
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `comprovante-grupo-${grupo.promoCode}.${extensao}`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);

			toast.success('Comprovante baixado com sucesso!');
		} catch (error) {
			console.error('Erro ao baixar comprovante:', error);
			toast.error('Erro ao baixar comprovante');
		} finally {
			isDownloading = false;
		}
	}

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
		return async ({ formData }: { formData: FormData; cancel: () => void }) => {
			isSubmitting = true;

			const statusAlteracao = formData.get('status') as string;

			console.log('Frontend - dados enviados:', {
				promoCode: formData.get('promoCode'),
				status: statusAlteracao,
				valorTotal: formData.get('valorTotal'),
				vendedorNome: formData.get('vendedorNome'),
				quantidadeClientes: formData.get('quantidadeClientes')
			});

			// Não cancelar aqui - deixar as validações para o servidor
			// As validações do frontend serão feitas apenas para UX, mas não bloqueiam o envio

			return async ({
				result,
				update
			}: {
				result: { type: string; error?: { message: string }; data?: { message: string } };
				update: () => Promise<void>;
			}) => {
				isSubmitting = false;

				if (result.type === 'error') {
					toast.error(result.error?.message || 'Erro ao processar pagamento do grupo');
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
	<Sheet.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="outline"
				class="w-full border border-zinc-700/50 bg-zinc-900/60 backdrop-blur-sm transition-all duration-200 hover:border-zinc-600/50 hover:bg-zinc-800/80  {status ===
				'Aguardando Pagamento'
					? 'text-amber-400 hover:text-amber-300'
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
		{/snippet}
	</Sheet.Trigger>

	<Sheet.Content
		side="right"
		class="w-full max-w-[95vw] border-zinc-800/50 bg-zinc-950 px-5 pt-5 backdrop-blur-xl md:max-w-[600px] md:min-w-[600px]"
	>
		<Sheet.Header class="space-y-2 ">
			<div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
				<Sheet.Title class="flex items-center gap-2 text-xl font-bold text-zinc-100 md:text-2xl">
					<FileText class="h-5 w-5 text-amber-400 md:h-6 md:w-6" />
					<span class="truncate">Grupo: {grupo.promoCode}</span>
				</Sheet.Title>
				<Badge class="{getStatusColor(status)} font-medium">
					<div class="flex items-center gap-1">
						<svelte:component this={getStatusIcon(status)} class="h-4 w-4" />
						<span class="text-xs md:text-sm">{status}</span>
					</div>
				</Badge>
			</div>
			<Sheet.Description class="text-sm text-zinc-400 md:text-base">
				{status === 'Aguardando Pagamento'
					? 'Processe o pagamento para todos os clientes deste grupo'
					: 'Informações do pagamento realizado'}
			</Sheet.Description>
		</Sheet.Header>

		<div
			class="scrollbar-thin scrollbar-track-zinc-900/50 scrollbar-thumb-zinc-800/50 h-[70%] overflow-y-auto pr-2 md:h-[calc(100vh-200px)]"
		>
			<div class="space-y-4">
				<!-- Informações do Vendedor -->
				<Card.Root class="border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm">
					<Card.Header>
						<Card.Title class="flex items-center gap-2 text-base text-amber-400 md:text-lg">
							<User class="h-4 w-4 md:h-5 md:w-5" />
							Informações do Vendedor
						</Card.Title>
					</Card.Header>
					<Card.Content class="space-y-4">
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div class="space-y-2">
								<Label class="text-sm font-medium text-zinc-400 md:text-base">Nome:</Label>
								<div
									class="rounded-lg bg-zinc-800/50 px-3 py-2 text-sm font-medium text-zinc-100 md:text-base"
								>
									{grupo.vendedor?.nome || 'Não informado'}
								</div>
							</div>
							<div class="space-y-2">
								<Label class="text-sm font-medium text-zinc-400 md:text-base">Telefone:</Label>
								<div class="rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 md:text-base">
									{grupo.vendedor?.telefone
										? formatarTelefone(grupo.vendedor.telefone)
										: 'Não informado'}
								</div>
							</div>
						</div>

						{#if grupo.vendedor?.pixCode}
							<div class="space-y-2">
								<Label class="text-sm font-medium text-zinc-400 md:text-base">
									Chave PIX ({grupo.vendedor.pixType?.toUpperCase()}):
								</Label>
								<div
									class="rounded-lg border border-zinc-700/50 bg-zinc-800/70 px-3 py-2 font-mono text-sm break-all text-zinc-100 md:text-base"
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
						<Card.Header>
							<Card.Title class="flex items-center gap-2 text-base text-emerald-400 md:text-lg">
								<DollarSign class="h-4 w-4 md:h-5 md:w-5" />
								Resumo do Pagamento
							</Card.Title>
						</Card.Header>
						<Card.Content class="space-y-3">
							<div class="flex items-center justify-between">
								<span class="text-sm text-zinc-400 md:text-base">Valor dos Planos:</span>
								<span class="text-base font-semibold text-zinc-100 md:text-lg"
									>R$ {grupo.valorTotal.toFixed(2)}</span
								>
							</div>

							{#if grupo.bonusIndicacaoResgatado > 0}
								<div class="flex items-center justify-between">
									<span class="flex items-center gap-1 text-sm text-amber-400 md:text-base">
										<Gift class="h-3 w-3 md:h-4 md:w-4" />
										Bônus Resgatado:
									</span>
									<span class="text-base font-semibold text-amber-400 md:text-lg">
										+R$ {grupo.bonusIndicacaoResgatado.toFixed(2)}
									</span>
								</div>
							{/if}

							<div
								class="mt-1 flex items-center justify-between rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 md:px-4"
							>
								<span class="text-lg font-bold text-emerald-400 md:text-xl">TOTAL:</span>
								<span class="text-xl font-bold text-emerald-400 md:text-2xl"
									>R$ {valorTotalFinal.toFixed(2)}</span
								>
							</div>
						</Card.Content>
					</Card.Root>

					<!-- Botão de Download do Comprovante - apenas para status Pago -->
					{#if status === 'Pago'}
						<Card.Root class="border-emerald-800/50 bg-emerald-900/20 backdrop-blur-sm">
							<Card.Header>
								<Card.Title class="flex items-center gap-2 text-base text-emerald-400 md:text-lg">
									<FileText class="h-4 w-4 md:h-5 md:w-5" />
									Comprovante do Pagamento
								</Card.Title>
							</Card.Header>
							<Card.Content>
								<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
									<div class="text-sm text-zinc-400">Baixar comprovante do pagamento do grupo</div>
									<Button
										onclick={baixarComprovante}
										disabled={isDownloading}
										class="w-full bg-emerald-600 text-white hover:bg-emerald-700 md:w-auto"
									>
										{#if isDownloading}
											<div
												class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
											></div>
											Baixando...
										{:else}
											<Download class="mr-2 h-4 w-4" />
											Baixar Comprovante
										{/if}
									</Button>
								</div>
							</Card.Content>
						</Card.Root>
					{/if}

					<!-- Form de Ação -->
					{#if status === 'Aguardando Pagamento' && cargo === 'Financeiro'}
						<Card.Root class="border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm">
							<Card.Header>
								<Card.Title class="text-base text-amber-400 md:text-lg"
									>Processar Pagamento</Card.Title
								>
							</Card.Header>
							<Card.Content>
								<div class="space-y-4">
									<div class="space-y-2">
										<Label for="status" class="text-sm font-medium text-zinc-300 md:text-base"
											>Alterar Status do Grupo:</Label
										>
										<Select.Root
											type="single"
											required
											onValueChange={(value) => (selectedStatus = value || '')}
										>
											<Select.Trigger
												class="w-full rounded-lg border border-zinc-700/50 bg-zinc-800/50 p-3 text-sm text-zinc-100 transition-colors focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 md:p-2 md:text-base"
											>
												<span data-slot="select-value">Selecione uma ação</span>
											</Select.Trigger>
											<Select.Content class="border border-zinc-700/50">
												<Select.Item value="Pago" class="flex items-center gap-2">
													<CheckCircle class="h-4 w-4 text-emerald-400" />
													Marcar como Pago
												</Select.Item>
												<Select.Item value="Cancelado" class="flex items-center gap-2">
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
											<Label
												for="comprovante"
												class="text-sm font-medium text-zinc-300 md:text-base"
											>
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
											<p class="text-xs text-zinc-500 md:text-sm">
												Formatos aceitos: JPG, PNG, WEBP, PDF (máx. 5MB)
											</p>
										</div>
									{/if}

									<!-- Campo de motivo apenas para cancelamento -->
									{#if selectedStatus === 'Cancelado'}
										<div class="space-y-2">
											<Label for="motivo" class="text-sm font-medium text-zinc-300 md:text-base">
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
											<p class="text-xs text-zinc-500 md:text-sm">
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
			<div class="flex w-full flex-col gap-3 md:flex-row md:justify-end">
				<Sheet.Close>
					{#snippet child({ props })}
						<Button
							{...props}
							variant="outline"
							class="order-2 border-zinc-700/50 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50 hover:text-zinc-100 md:order-1"
						>
							Fechar
						</Button>
					{/snippet}
				</Sheet.Close>

				{#if status === 'Aguardando Pagamento' && cargo === 'Financeiro'}
					<Button
						type="submit"
						disabled={isSubmitting || !selectedStatus}
						form="form-{grupo.promoCode}"
						class="order-1 bg-gradient-to-r from-amber-500 to-amber-600 font-medium text-white shadow-lg transition-all duration-200 hover:from-amber-600 hover:to-amber-700 disabled:cursor-not-allowed disabled:opacity-50 md:order-2"
					>
						{isSubmitting ? 'Processando...' : 'Processar'}
					</Button>
				{/if}
			</div>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
