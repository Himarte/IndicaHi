<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { formatarCPF, formatarCNPJ, formatarTelefone } from '$lib/uteis/masks';
	import type { LeadsSchema } from '$lib/server/database/schema';
	import {
		User,
		Phone,
		CreditCard,
		Calendar,
		FileText,
		Download,
		AlertCircle,
		Edit,
		Save,
		X,
		Trash2,
		Upload,
		Check
	} from '@lucide/svelte';

	interface Props {
		lead: LeadsSchema;
		status:
			| 'pendentes'
			| 'em-atendimento'
			| 'aguardando-pagamento'
			| 'pagos'
			| 'finalizados'
			| 'cancelados';
		open?: LeadsSchema | null;
		onClose?: () => void;
	}

	let { lead, status, open = null, onClose }: Props = $props();

	// Configuração de cores por status
	const statusConfig = {
		pendentes: {
			badgeColor: 'bg-red-600 hover:bg-red-600 text-white',
			label: 'Pendente'
		},
		'em-atendimento': {
			badgeColor: 'bg-blue-600 hover:bg-blue-600 text-white',
			label: 'Em Atendimento'
		},
		'aguardando-pagamento': {
			badgeColor: 'bg-yellow-600 hover:bg-yellow-600 text-white',
			label: 'Aguardando Pagamento'
		},
		pagos: {
			badgeColor: 'bg-green-600 hover:bg-green-600 text-white',
			label: 'Pago'
		},
		finalizados: {
			badgeColor: 'bg-emerald-600 hover:bg-emerald-600 text-white',
			label: 'Finalizado'
		},
		cancelados: {
			badgeColor: 'bg-gray-600 hover:bg-gray-600 text-white',
			label: 'Cancelado'
		}
	};

	let isSubmitting = $state(false);
	let formEl = $state<HTMLFormElement>();

	// Estados dos campos editáveis
	let selectedStatus = $state<
		'Pendente' | 'Sendo Atendido' | 'Finalizado' | 'Pago' | 'Cancelado' | 'Aguardando Pagamento'
	>(lead.status || 'Pendente');
	let selectedPlanoModelo = $state<'CPF' | 'CNPJ'>(lead.planoModelo || 'CPF');

	// Estados para funcionalidades específicas por status
	let isDownloadingComprovante = $state(false);
	let motivoCancelamento = $state<string | null>(null);
	let loadingMotivo = $state(false);
	let salvandoMotivo = $state(false);
	let editandoMotivo = $state(false);
	let novoMotivo = $state('');

	// Estados para gerenciamento de comprovantes
	let comprovanteExiste = $state<boolean | null>(null);
	let verificandoComprovante = $state(false);
	let excluindoComprovante = $state(false);
	let anexandoComprovante = $state(false);
	let modoAnexar = $state(false);
	let arquivoSelecionado = $state<File | null>(null);

	// Estado para dialog de confirmação de exclusão
	let mostrarDialogExclusao = $state(false);

	// Controle de abertura do sheet
	let isOpen = $derived(open !== null);

	// Função para baixar comprovante (similar ao BotaoBaixarFinanceiro)
	const baixarComprovante = async () => {
		if (isDownloadingComprovante) return;

		try {
			isDownloadingComprovante = true;

			const response = await fetch(`/api/indicacoes/financeiro/comprovante/${lead.id}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				if (response.status === 404) {
					toast.error('Comprovante não encontrado para este lead');
				} else {
					toast.error('Erro ao buscar comprovante');
				}
				return;
			}

			const data = await response.json();
			const comprovanteBase64 = data.comprovante;

			if (!comprovanteBase64) {
				toast.error('Comprovante não disponível');
				return;
			}

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
			link.download = `comprovante-${lead.fullName.replace(/\s+/g, '_')}.${extensao}`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);

			toast.success('Comprovante baixado com sucesso!');
		} catch (error) {
			console.error('Erro ao baixar comprovante:', error);
			toast.error('Erro ao baixar comprovante');
		} finally {
			isDownloadingComprovante = false;
		}
	};

	// Função para buscar motivo do cancelamento
	const buscarMotivoCancelamento = async () => {
		if (loadingMotivo) return;

		try {
			loadingMotivo = true;

			// Busca direta no banco usando uma query simples
			const response = await fetch(`/api/admin/leads/motivo/${lead.id}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				if (response.status === 404) {
					motivoCancelamento = 'Motivo não encontrado no sistema';
				} else {
					motivoCancelamento = 'Erro ao buscar motivo';
				}
				return;
			}

			const data = await response.json();

			if (data.motivo) {
				motivoCancelamento = data.motivo;
				novoMotivo = data.motivo; // Para permitir edição
			} else {
				motivoCancelamento = 'Motivo não encontrado';
			}
		} catch (error) {
			console.error('Erro ao buscar motivo do cancelamento:', error);
			motivoCancelamento = 'Erro ao carregar motivo';
		} finally {
			loadingMotivo = false;
		}
	};

	// Função para salvar motivo editado
	const salvarMotivo = async () => {
		if (!novoMotivo.trim()) {
			toast.error('Motivo não pode estar vazio');
			return;
		}

		try {
			salvandoMotivo = true;

			const response = await fetch(`/api/admin/leads/motivo/${lead.id}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ motivo: novoMotivo.trim() })
			});

			if (!response.ok) {
				throw new Error('Erro ao salvar motivo');
			}

			motivoCancelamento = novoMotivo.trim();
			editandoMotivo = false;
			toast.success('Motivo atualizado com sucesso!');
		} catch (error) {
			console.error('Erro ao salvar motivo:', error);
			toast.error('Erro ao salvar motivo');
		} finally {
			salvandoMotivo = false;
		}
	};

	// Função para verificar se existe comprovante
	const verificarComprovante = async () => {
		if (verificandoComprovante) return;

		try {
			verificandoComprovante = true;

			// Usar a API existente que já está funcionando
			const response = await fetch(`/api/indicacoes/financeiro/comprovante/${lead.id}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			comprovanteExiste = response.ok;
		} catch (error) {
			console.error('Erro ao verificar comprovante:', error);
			comprovanteExiste = false;
		} finally {
			verificandoComprovante = false;
		}
	};

	// Função para excluir comprovante
	const excluirComprovante = async () => {
		try {
			excluindoComprovante = true;

			const response = await fetch(`/api/admin/leads/comprovante/${lead.id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error('Erro ao excluir comprovante');
			}

			comprovanteExiste = false;
			mostrarDialogExclusao = false;
			toast.success('Comprovante excluído com sucesso!');
		} catch (error) {
			console.error('Erro ao excluir comprovante:', error);
			toast.error('Erro ao excluir comprovante');
		} finally {
			excluindoComprovante = false;
		}
	};

	// Função para confirmar exclusão do comprovante
	const confirmarExclusaoComprovante = () => {
		mostrarDialogExclusao = true;
	};

	// Função para anexar novo comprovante
	const anexarComprovante = async () => {
		if (!arquivoSelecionado) {
			toast.error('Selecione um arquivo para anexar');
			return;
		}

		// Validações do arquivo
		const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
		if (!tiposPermitidos.includes(arquivoSelecionado.type)) {
			toast.error('Formato de arquivo inválido. Use JPG, PNG, WEBP ou PDF');
			return;
		}

		if (arquivoSelecionado.size > 5 * 1024 * 1024) {
			toast.error('Arquivo deve ter no máximo 5MB');
			return;
		}

		try {
			anexandoComprovante = true;

			const formData = new FormData();
			formData.append('comprovante', arquivoSelecionado);

			const response = await fetch(`/api/admin/leads/comprovante/${lead.id}`, {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Erro ao anexar comprovante');
			}

			comprovanteExiste = true;
			modoAnexar = false;
			arquivoSelecionado = null;
			toast.success('Comprovante anexado com sucesso!');
		} catch (error) {
			console.error('Erro ao anexar comprovante:', error);
			toast.error('Erro ao anexar comprovante');
		} finally {
			anexandoComprovante = false;
		}
	};

	// Verificar comprovante quando o sheet abrir para leads pagos
	$effect(() => {
		if (open && lead.status === 'Pago' && comprovanteExiste === null) {
			verificarComprovante();
		}
	});

	const handleSubmit = () => {
		return async ({
			result,
			update
		}: {
			result: { type: string; error?: { message: string }; data?: { message: string } };
			update: () => Promise<void>;
		}) => {
			isSubmitting = false;

			if (result.type === 'error') {
				toast.error(result.error?.message || 'Erro ao atualizar lead');
				return;
			}

			if (result.type === 'failure') {
				toast.error(result.data?.message || 'Falha ao atualizar lead');
				return;
			}

			toast.success('Lead atualizado com sucesso!');
			formEl?.reset();
			onClose?.();
			await update();
		};
	};

	const fecharSheet = () => {
		onClose?.();
	};
</script>

<Sheet.Root bind:open={isOpen} onOpenChange={(opened) => !opened && fecharSheet()}>
	<Sheet.Content
		side="right"
		class="w-full max-w-[95vw] border-zinc-800/50 bg-zinc-950 px-5 pt-5 backdrop-blur-xl md:max-w-[600px] md:min-w-[600px]"
	>
		<Sheet.Header class="space-y-2">
			<div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
				<Sheet.Title class="flex items-center gap-2 text-xl font-bold text-zinc-100 md:text-2xl">
					<FileText class="h-5 w-5 text-orange-400 md:h-6 md:w-6" />
					<span class="truncate">Editar Lead</span>
				</Sheet.Title>
				<Badge class="{statusConfig[status].badgeColor} font-medium">
					{statusConfig[status].label}
				</Badge>
			</div>
			<Sheet.Description class="text-sm text-zinc-400 md:text-base">
				Edite as informações do lead {lead.fullName}
			</Sheet.Description>
		</Sheet.Header>

		<form
			bind:this={formEl}
			method="POST"
			action="?/updateLead"
			class="scrollbar-thin scrollbar-track-zinc-900/50 scrollbar-thumb-zinc-800/50 h-[calc(100vh-200px)] space-y-6 overflow-y-auto pr-2"
			use:enhance={handleSubmit}
		>
			<input type="hidden" name="leadId" value={lead.id} />

			<!-- Informações Básicas -->
			<div class="space-y-4 rounded-lg border border-zinc-800/50 bg-zinc-900/50 p-4">
				<div class="flex items-center gap-2 text-lg font-semibold text-orange-400">
					<User class="h-5 w-5" />
					Informações Básicas
				</div>

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="fullName" class="text-sm font-medium text-zinc-300">Nome Completo</Label>
						<Input
							id="fullName"
							name="fullName"
							value={lead.fullName}
							placeholder="Nome completo do cliente"
							class="border-zinc-700 bg-zinc-800 text-white"
						/>
					</div>

					<div class="space-y-2">
						<Label for="status" class="text-sm font-medium text-zinc-300">Status</Label>
						<Select.Root
							type="single"
							onValueChange={(value) => {
								if (
									value &&
									[
										'Pendente',
										'Sendo Atendido',
										'Finalizado',
										'Pago',
										'Cancelado',
										'Aguardando Pagamento'
									].includes(value)
								) {
									selectedStatus = value as typeof selectedStatus;
								}
							}}
							value={selectedStatus}
						>
							<Select.Trigger class="border-zinc-700 bg-zinc-800 text-white">
								<span data-slot="select-value">{selectedStatus}</span>
							</Select.Trigger>
							<Select.Content class="border border-zinc-700/50 bg-zinc-900">
								<Select.Item value="Pendente">Pendente</Select.Item>
								<Select.Item value="Sendo Atendido">Sendo Atendido</Select.Item>
								<Select.Item value="Aguardando Pagamento">Aguardando Pagamento</Select.Item>
								<Select.Item value="Pago">Pago</Select.Item>
								<Select.Item value="Finalizado">Finalizado</Select.Item>
								<Select.Item value="Cancelado">Cancelado</Select.Item>
							</Select.Content>
							<input type="hidden" name="status" bind:value={selectedStatus} />
						</Select.Root>
					</div>
				</div>

				<div class="space-y-2">
					<Label for="promoCode" class="text-sm font-medium text-zinc-300">Código Promocional</Label
					>
					<Input
						id="promoCode"
						name="promoCode"
						value={lead.promoCode || ''}
						placeholder="Código promocional"
						maxlength={15}
						class="border-zinc-700 bg-zinc-800 font-mono text-white"
					/>
				</div>
			</div>

			<!-- Informações de Contato -->
			<div class="space-y-4 rounded-lg border border-zinc-800/50 bg-zinc-900/50 p-4">
				<div class="flex items-center gap-2 text-lg font-semibold text-orange-400">
					<Phone class="h-5 w-5" />
					Informações de Contato
				</div>

				<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
					<div class="space-y-2">
						<Label for="telefone" class="text-sm font-medium text-zinc-300">Telefone</Label>
						<Input
							id="telefone"
							name="telefone"
							value={lead.telefone ? formatarTelefone(lead.telefone) : ''}
							placeholder="(00) 00000-0000"
							maxlength={15}
							class="border-zinc-700 bg-zinc-800 text-white"
						/>
					</div>

					<div class="space-y-2">
						<Label for="cpf" class="text-sm font-medium text-zinc-300">CPF</Label>
						<Input
							id="cpf"
							name="cpf"
							value={lead.cpf ? formatarCPF(lead.cpf) : ''}
							placeholder="000.000.000-00"
							maxlength={14}
							class="border-zinc-700 bg-zinc-800 text-white"
						/>
					</div>

					<div class="space-y-2">
						<Label for="cnpj" class="text-sm font-medium text-zinc-300">CNPJ</Label>
						<Input
							id="cnpj"
							name="cnpj"
							value={lead.cnpj ? formatarCNPJ(lead.cnpj) : ''}
							placeholder="00.000.000/0000-00"
							maxlength={18}
							class="border-zinc-700 bg-zinc-800 text-white"
						/>
					</div>
				</div>
			</div>

			<!-- Informações do Plano -->
			<div class="space-y-4 rounded-lg border border-zinc-800/50 bg-zinc-900/50 p-4">
				<div class="flex items-center gap-2 text-lg font-semibold text-orange-400">
					<CreditCard class="h-5 w-5" />
					Informações do Plano
				</div>

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="planoNome" class="text-sm font-medium text-zinc-300">Nome do Plano</Label>
						<Input
							id="planoNome"
							name="planoNome"
							value={lead.planoNome || ''}
							placeholder="Nome do plano"
							maxlength={256}
							class="border-zinc-700 bg-zinc-800 text-white"
						/>
					</div>

					<div class="space-y-2">
						<Label for="planoMegas" class="text-sm font-medium text-zinc-300">Megas do Plano</Label>
						<Input
							id="planoMegas"
							name="planoMegas"
							type="number"
							min="0"
							value={lead.planoMegas || ''}
							placeholder="Velocidade em MB"
							class="border-zinc-700 bg-zinc-800 text-white"
						/>
					</div>
				</div>

				<div class="space-y-2">
					<Label for="planoModelo" class="text-sm font-medium text-zinc-300">Modelo do Plano</Label>
					<Select.Root
						type="single"
						onValueChange={(value) => {
							if (value && ['CPF', 'CNPJ'].includes(value)) {
								selectedPlanoModelo = value as typeof selectedPlanoModelo;
							}
						}}
						value={selectedPlanoModelo}
					>
						<Select.Trigger class="border-zinc-700 bg-zinc-800 text-white">
							<span data-slot="select-value">{selectedPlanoModelo}</span>
						</Select.Trigger>
						<Select.Content class="border border-zinc-700/50 bg-zinc-900">
							<Select.Item value="CPF">CPF</Select.Item>
							<Select.Item value="CNPJ">CNPJ</Select.Item>
						</Select.Content>
						<input type="hidden" name="planoModelo" bind:value={selectedPlanoModelo} />
					</Select.Root>
				</div>
			</div>

			<!-- Informações de Atendimento -->
			<div class="space-y-4 rounded-lg border border-zinc-800/50 bg-zinc-900/50 p-4">
				<div class="flex items-center gap-2 text-lg font-semibold text-orange-400">
					<Calendar class="h-5 w-5" />
					Informações de Atendimento
				</div>

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="atendidoPor" class="text-sm font-medium text-zinc-300">Atendido Por</Label>
						<Input
							id="atendidoPor"
							name="atendidoPor"
							value={lead.atendidoPor || ''}
							placeholder="Nome do atendente"
							maxlength={256}
							class="border-zinc-700 bg-zinc-800 text-white"
						/>
					</div>

					<div class="space-y-2">
						<Label for="pagoPor" class="text-sm font-medium text-zinc-300">Pago Por</Label>
						<Input
							id="pagoPor"
							name="pagoPor"
							value={lead.pagoPor || ''}
							placeholder="Nome do responsável pelo pagamento"
							maxlength={256}
							class="border-zinc-700 bg-zinc-800 text-white"
						/>
					</div>
				</div>
			</div>

			<!-- Seção específica para leads pagos: Comprovante de Pagamento -->
			{#if lead.status === 'Pago'}
				<div class="space-y-4 rounded-lg border border-green-800/50 bg-green-900/20 p-4">
					<div class="flex items-center gap-2 text-lg font-semibold text-green-400">
						<FileText class="h-5 w-5" />
						Comprovante de Pagamento
					</div>

					{#if verificandoComprovante || excluindoComprovante || anexandoComprovante}
						<!-- Skeleton durante operações -->
						<div class="space-y-3">
							<div class="rounded-lg border border-green-700/50 bg-green-800/30 p-3">
								<div class="space-y-2">
									<div class="h-4 w-full animate-pulse rounded bg-zinc-600/50"></div>
									<div class="h-4 w-3/4 animate-pulse rounded bg-zinc-600/50"></div>
								</div>
							</div>
							<div class="flex gap-2">
								<div class="h-8 w-24 animate-pulse rounded bg-zinc-600/50"></div>
								<div class="h-8 w-20 animate-pulse rounded bg-zinc-600/50"></div>
							</div>
							<div class="flex items-center gap-2 text-sm text-zinc-400">
								<div
									class="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent"
								></div>
								{verificandoComprovante
									? 'Verificando comprovante...'
									: excluindoComprovante
										? 'Excluindo comprovante...'
										: 'Anexando comprovante...'}
							</div>
						</div>
					{:else if comprovanteExiste === false}
						<!-- Estado sem comprovante -->
						<div class="space-y-3">
							<div class="rounded-lg border border-zinc-700/50 bg-zinc-800/50 p-3">
								<p class="text-sm text-zinc-400 italic">Nenhum comprovante anexado</p>
							</div>

							{#if !modoAnexar}
								<Button
									type="button"
									onclick={() => (modoAnexar = true)}
									class="w-full bg-green-600 text-white hover:bg-green-700 md:w-auto"
								>
									<Upload class="mr-2 h-4 w-4" />
									Anexar Comprovante
								</Button>
							{:else}
								<!-- Modo anexar arquivo -->
								<div class="space-y-3">
									<div class="space-y-2">
										<label
											for="arquivo-comprovante-anexar"
											class="text-sm font-medium text-zinc-300"
										>
											Selecionar arquivo:
										</label>
										<input
											id="arquivo-comprovante-anexar"
											type="file"
											accept=".jpg,.jpeg,.png,.pdf,.webp"
											onchange={(e) => {
												const file = e.currentTarget.files?.[0];
												arquivoSelecionado = file || null;
											}}
											class="block w-full rounded-lg border border-green-700/50 bg-green-800/20 px-3 py-2 text-sm text-zinc-200 file:mr-4 file:rounded-full file:border-none file:bg-green-600 file:px-4 file:py-2 file:text-sm file:text-white file:hover:bg-green-700"
										/>
										<p class="text-xs text-zinc-500">
											Formatos aceitos: JPG, PNG, WEBP, PDF (máx. 5MB)
										</p>
									</div>
									<div class="flex gap-2">
										<Button
											type="button"
											onclick={anexarComprovante}
											disabled={!arquivoSelecionado}
											class="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
										>
											<Check class="mr-2 h-4 w-4" />
											Confirmar
										</Button>
										<Button
											type="button"
											variant="outline"
											onclick={() => {
												modoAnexar = false;
												arquivoSelecionado = null;
											}}
											class="border-zinc-700/50 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50"
										>
											<X class="mr-2 h-4 w-4" />
											Cancelar
										</Button>
									</div>
								</div>
							{/if}
						</div>
					{:else if comprovanteExiste === true}
						<!-- Estado com comprovante existente -->
						<div class="space-y-3">
							<div class="rounded-lg border border-green-700/50 bg-green-800/30 p-3">
								<p class="text-sm text-green-200">✓ Comprovante anexado</p>
								<p class="mt-1 text-xs text-zinc-400">
									Clique em "Baixar" para visualizar o arquivo
								</p>
							</div>

							<div class="flex flex-wrap gap-2">
								<Button
									type="button"
									onclick={baixarComprovante}
									disabled={isDownloadingComprovante}
									class="w-32 bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
								>
									{#if isDownloadingComprovante}
										<div
											class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
										></div>
										Baixando...
									{:else}
										<Download class="mr-2 h-4 w-4" />
										Baixar
									{/if}
								</Button>

								<Button
									type="button"
									variant="outline"
									onclick={confirmarExclusaoComprovante}
									class="w-32 border-red-700/50 bg-red-800/50 text-red-300 hover:bg-red-700/50"
								>
									<Trash2 class="mr-2 h-4 w-4" />
									Excluir
								</Button>

								<Button
									type="button"
									variant="outline"
									onclick={() => (modoAnexar = true)}
									class="w-32 border-zinc-700/50 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50"
								>
									<Upload class="mr-2 h-4 w-4" />
									Substituir
								</Button>
							</div>

							{#if modoAnexar}
								<!-- Modo substituir arquivo -->
								<div class="space-y-3 border-t border-zinc-700/50 pt-3">
									<div class="space-y-2">
										<label
											for="arquivo-comprovante-substituir"
											class="text-sm font-medium text-zinc-300"
										>
											Selecionar novo arquivo:
										</label>
										<input
											id="arquivo-comprovante-substituir"
											type="file"
											accept=".jpg,.jpeg,.png,.pdf,.webp"
											onchange={(e) => {
												const file = e.currentTarget.files?.[0];
												arquivoSelecionado = file || null;
											}}
											class="block w-full rounded-lg border border-green-700/50 bg-green-800/20 px-3 py-2 text-sm text-zinc-200 file:mr-4 file:rounded-full file:border-none file:bg-green-600 file:px-4 file:py-2 file:text-sm file:text-white file:hover:bg-green-700"
										/>
									</div>
									<div class="flex gap-2">
										<Button
											type="button"
											onclick={anexarComprovante}
											disabled={!arquivoSelecionado}
											class="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
										>
											<Check class="mr-2 h-4 w-4" />
											Substituir
										</Button>
										<Button
											type="button"
											variant="outline"
											onclick={() => {
												modoAnexar = false;
												arquivoSelecionado = null;
											}}
											class="border-zinc-700/50 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50"
										>
											<X class="mr-2 h-4 w-4" />
											Cancelar
										</Button>
									</div>
								</div>
							{/if}
						</div>
					{/if}
				</div>
			{/if}

			<!-- Seção específica para leads cancelados: Motivo do Cancelamento -->
			{#if lead.status === 'Cancelado'}
				<div class="space-y-4 rounded-lg border border-red-800/50 bg-red-900/20 p-4">
					<div class="flex items-center gap-2 text-lg font-semibold text-red-400">
						<AlertCircle class="h-5 w-5" />
						Motivo do Cancelamento
					</div>

					{#if loadingMotivo || salvandoMotivo}
						<!-- Skeleton durante carregamento ou salvamento -->
						<div class="space-y-3">
							<!-- Skeleton para área do motivo -->
							<div class="rounded-lg border border-red-700/50 bg-red-800/30 p-3">
								<div class="space-y-2">
									<div class="h-4 w-full animate-pulse rounded bg-zinc-600/50"></div>
									<div class="h-4 w-4/5 animate-pulse rounded bg-zinc-600/50"></div>
									<div class="h-4 w-3/4 animate-pulse rounded bg-zinc-600/50"></div>
								</div>
							</div>
							<!-- Skeleton para botões -->
							<div class="flex gap-2">
								<div class="h-8 w-20 animate-pulse rounded bg-zinc-600/50"></div>
								<div class="h-8 w-24 animate-pulse rounded bg-zinc-600/50"></div>
							</div>
							<!-- Indicador de texto -->
							<div class="flex items-center gap-2 text-sm text-zinc-400">
								<div
									class="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent"
								></div>
								{salvandoMotivo ? 'Salvando motivo...' : 'Carregando motivo...'}
							</div>
						</div>
					{:else if !motivoCancelamento}
						<!-- Estado inicial - botão para buscar motivo -->
						<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<div class="text-sm text-zinc-400">Clique para carregar o motivo do cancelamento</div>
							<Button
								type="button"
								onclick={buscarMotivoCancelamento}
								class="w-full bg-red-600 text-white hover:bg-red-700 md:w-auto"
							>
								<AlertCircle class="mr-2 h-4 w-4" />
								Ver Motivo
							</Button>
						</div>
					{:else}
						<!-- Estado com motivo carregado -->
						<div class="space-y-3">
							{#if !editandoMotivo}
								<!-- Visualização do motivo -->
								<div class="rounded-lg border border-red-700/50 bg-red-800/30 p-3">
									<p class="text-sm leading-relaxed text-zinc-200">{motivoCancelamento}</p>
								</div>
								<div class="flex gap-2">
									<Button
										type="button"
										variant="outline"
										size="sm"
										onclick={() => {
											editandoMotivo = true;
											novoMotivo = motivoCancelamento || '';
										}}
										class="border-zinc-700/50 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50"
									>
										<Edit class="mr-2 h-4 w-4" />
										Editar
									</Button>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onclick={buscarMotivoCancelamento}
										class="border-zinc-700/50 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50"
									>
										<AlertCircle class="mr-2 h-4 w-4" />
										Recarregar
									</Button>
								</div>
							{:else}
								<!-- Modo de edição -->
								<div class="space-y-3">
									<Textarea
										bind:value={novoMotivo}
										placeholder="Digite o motivo do cancelamento..."
										rows={4}
										class="resize-none border-red-700/50 bg-red-800/20 text-zinc-200 placeholder:text-zinc-500"
									/>
									<div class="flex gap-2">
										<Button
											type="button"
											size="sm"
											onclick={salvarMotivo}
											disabled={salvandoMotivo}
											class="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
										>
											{#if salvandoMotivo}
												<div
													class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
												></div>
												Salvando...
											{:else}
												<Save class="mr-2 h-4 w-4" />
												Salvar
											{/if}
										</Button>
										<Button
											type="button"
											variant="outline"
											size="sm"
											disabled={salvandoMotivo}
											onclick={() => {
												editandoMotivo = false;
												novoMotivo = '';
											}}
											class="border-zinc-700/50 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50 disabled:opacity-50"
										>
											<X class="mr-2 h-4 w-4" />
											Cancelar
										</Button>
									</div>
								</div>
							{/if}
						</div>
					{/if}
				</div>
			{/if}
		</form>

		<Sheet.Footer class="border-t border-zinc-800/50 pt-6">
			<div class="flex w-full flex-col gap-3 md:flex-row md:justify-end">
				<Button
					variant="outline"
					onclick={fecharSheet}
					class="order-2 border-zinc-700/50 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50 hover:text-zinc-100 md:order-1"
				>
					Cancelar
				</Button>

				<Button
					type="submit"
					disabled={isSubmitting}
					form={formEl?.id}
					onclick={() => {
						isSubmitting = true;
						formEl?.requestSubmit();
					}}
					class="order-1 bg-gradient-to-r from-orange-500 to-orange-600 font-medium text-white shadow-lg transition-all duration-200 hover:from-orange-600 hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-50 md:order-2"
				>
					{isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
				</Button>
			</div>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>

<!-- Dialog de confirmação para exclusão de comprovante -->
<AlertDialog.Root bind:open={mostrarDialogExclusao}>
	<AlertDialog.Content class="border-zinc-800/50 bg-zinc-950">
		<AlertDialog.Header>
			<AlertDialog.Title class="flex items-center gap-2 text-red-400">
				<Trash2 class="h-5 w-5" />
				Excluir Comprovante
			</AlertDialog.Title>
			<AlertDialog.Description class="text-zinc-400">
				Tem certeza que deseja excluir o comprovante? Esta ação não pode ser desfeita e o arquivo
				será removido permanentemente do sistema.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer class="flex justify-end gap-2 pt-4">
			<AlertDialog.Cancel
				class="border-zinc-700/50 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50"
			>
				Cancelar
			</AlertDialog.Cancel>
			<AlertDialog.Action
				onclick={excluirComprovante}
				disabled={excluindoComprovante}
				class="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
			>
				{#if excluindoComprovante}
					<div
						class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
					></div>
					Excluindo...
				{:else}
					<Trash2 class="mr-2 h-4 w-4" />
					Excluir Comprovante
				{/if}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
