<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { formatarCPF, formatarTelefone } from '$lib/uteis/masks';
	import type { UserSchema } from '$lib/server/database/schema';
	import { User, Phone, CreditCard, MapPin, DollarSign } from '@lucide/svelte';

	interface Props {
		usuario: UserSchema;
		tipo: 'vendedor-interno' | 'vendedor-externo' | 'administrador' | 'financeiro';
		open?: UserSchema | null;
		onClose?: () => void;
	}

	let { usuario, tipo, open = null, onClose }: Props = $props();

	// Configuração de cores por tipo
	const tipoConfig = {
		'vendedor-interno': {
			badgeColor: 'bg-blue-600 hover:bg-blue-600 text-white',
			label: 'Vendedor Interno'
		},
		'vendedor-externo': {
			badgeColor: 'bg-green-600 hover:bg-green-600 text-white',
			label: 'Vendedor Externo'
		},
		administrador: {
			badgeColor: 'bg-red-600 hover:bg-red-600 text-white',
			label: 'Administrador'
		},
		financeiro: {
			badgeColor: 'bg-yellow-600 hover:bg-yellow-600 text-white',
			label: 'Financeiro'
		}
	};

	let isSubmitting = $state(false);
	let formEl = $state<HTMLFormElement>();

	// Estados dos campos editáveis
	let selectedJob = $state(usuario.job || '');
	let selectedPixType = $state(usuario.pixType || '');
	let selectedStatus = $state(usuario.status ? 'true' : 'false');

	// Controle de abertura do sheet
	let isOpen = $derived(open !== null);

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
				toast.error(result.error?.message || 'Erro ao atualizar usuário');
				return;
			}

			if (result.type === 'failure') {
				toast.error(result.data?.message || 'Falha ao atualizar usuário');
				return;
			}

			toast.success('Usuário atualizado com sucesso!');
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
					<User class="h-5 w-5 text-orange-400 md:h-6 md:w-6" />
					<span class="truncate">Editar Usuário</span>
				</Sheet.Title>
				<Badge class="{tipoConfig[tipo].badgeColor} font-medium">
					{tipoConfig[tipo].label}
				</Badge>
			</div>
			<Sheet.Description class="text-sm text-zinc-400 md:text-base">
				Edite as informações do usuário {usuario.name}
			</Sheet.Description>
		</Sheet.Header>

		<form
			bind:this={formEl}
			method="POST"
			action="?/updateUser"
			class="scrollbar-thin scrollbar-track-zinc-900/50 scrollbar-thumb-zinc-800/50 h-[calc(100vh-200px)] space-y-6 overflow-y-auto pr-2"
			use:enhance={handleSubmit}
		>
			<input type="hidden" name="userId" value={usuario.id} />

			<!-- Informações Básicas -->
			<div class="space-y-4 rounded-lg border border-zinc-800/50 bg-zinc-900/50 p-4">
				<div class="flex items-center gap-2 text-lg font-semibold text-orange-400">
					<User class="h-5 w-5" />
					Informações Básicas
				</div>

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="name" class="text-sm font-medium text-zinc-300">Nome Completo</Label>
						<Input
							id="name"
							name="name"
							value={usuario.name}
							placeholder="Nome completo do usuário"
							class="border-zinc-700 bg-zinc-800 text-white"
						/>
					</div>

					<div class="space-y-2">
						<Label for="email" class="text-sm font-medium text-zinc-300">E-mail</Label>
						<Input
							id="email"
							name="email"
							type="email"
							value={usuario.email}
							placeholder="email@exemplo.com"
							class="border-zinc-700 bg-zinc-800 text-white"
						/>
					</div>
				</div>

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="job" class="text-sm font-medium text-zinc-300">Cargo</Label>
						<Select.Root
							type="single"
							onValueChange={(value) => (selectedJob = value || '')}
							value={selectedJob}
						>
							<Select.Trigger class="border-zinc-700 bg-zinc-800 text-white">
								<span data-slot="select-value">{selectedJob || 'Selecione um cargo'}</span>
							</Select.Trigger>
							<Select.Content class="border border-zinc-700/50 bg-zinc-900">
								<Select.Item value="Vendedor Externo">Vendedor Externo</Select.Item>
								<Select.Item value="Vendedor Interno">Vendedor Interno</Select.Item>
								<Select.Item value="Financeiro">Financeiro</Select.Item>
								<Select.Item value="Admin">Admin</Select.Item>
							</Select.Content>
							<input type="hidden" name="job" bind:value={selectedJob} />
						</Select.Root>
					</div>

					<div class="space-y-2">
						<Label for="status" class="text-sm font-medium text-zinc-300">Status</Label>
						<Select.Root
							type="single"
							onValueChange={(value) => (selectedStatus = value || 'true')}
							value={selectedStatus}
						>
							<Select.Trigger class="border-zinc-700 bg-zinc-800 text-white">
								<span data-slot="select-value">
									{selectedStatus === 'true' ? 'Ativo' : 'Inativo'}
								</span>
							</Select.Trigger>
							<Select.Content class="border border-zinc-700/50 bg-zinc-900">
								<Select.Item value="true">Ativo</Select.Item>
								<Select.Item value="false">Inativo</Select.Item>
							</Select.Content>
							<input type="hidden" name="status" bind:value={selectedStatus} />
						</Select.Root>
					</div>
				</div>
			</div>

			<!-- Informações de Contato -->
			<div class="space-y-4 rounded-lg border border-zinc-800/50 bg-zinc-900/50 p-4">
				<div class="flex items-center gap-2 text-lg font-semibold text-orange-400">
					<Phone class="h-5 w-5" />
					Informações de Contato
				</div>

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="cpf" class="text-sm font-medium text-zinc-300">CPF</Label>
						<Input
							id="cpf"
							name="cpf"
							value={usuario.cpf ? formatarCPF(usuario.cpf) : ''}
							placeholder="000.000.000-00"
							maxlength={14}
							class="border-zinc-700 bg-zinc-800 text-white"
						/>
					</div>

					<div class="space-y-2">
						<Label for="telefone" class="text-sm font-medium text-zinc-300">Telefone</Label>
						<Input
							id="telefone"
							name="telefone"
							value={usuario.telefone ? formatarTelefone(usuario.telefone) : ''}
							placeholder="(00) 00000-0000"
							maxlength={15}
							class="border-zinc-700 bg-zinc-800 text-white"
						/>
					</div>
				</div>

				<div class="space-y-2">
					<Label for="promoCode" class="text-sm font-medium text-zinc-300">Código Promocional</Label
					>
					<Input
						id="promoCode"
						name="promoCode"
						value={usuario.promoCode || ''}
						placeholder="Código promocional único"
						maxlength={15}
						class="border-zinc-700 bg-zinc-800 font-mono text-white"
					/>
				</div>
			</div>

			<!-- Informações PIX -->
			<div class="space-y-4 rounded-lg border border-zinc-800/50 bg-zinc-900/50 p-4">
				<div class="flex items-center gap-2 text-lg font-semibold text-orange-400">
					<CreditCard class="h-5 w-5" />
					Informações PIX
				</div>

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="pixType" class="text-sm font-medium text-zinc-300">Tipo da Chave PIX</Label>
						<Select.Root
							type="single"
							onValueChange={(value) => (selectedPixType = value || '')}
							value={selectedPixType}
						>
							<Select.Trigger class="border-zinc-700 bg-zinc-800 text-white">
								<span data-slot="select-value">
									{selectedPixType ? selectedPixType.toUpperCase() : 'Selecione o tipo'}
								</span>
							</Select.Trigger>
							<Select.Content class="border border-zinc-700/50 bg-zinc-900">
								<Select.Item value="cpf">CPF</Select.Item>
								<Select.Item value="cnpj">CNPJ</Select.Item>
							</Select.Content>
							<input type="hidden" name="pixType" bind:value={selectedPixType} />
						</Select.Root>
					</div>

					<div class="space-y-2">
						<Label for="pixCode" class="text-sm font-medium text-zinc-300">Chave PIX</Label>
						<Input
							id="pixCode"
							name="pixCode"
							value={usuario.pixCode || ''}
							placeholder="Chave PIX para recebimento"
							class="border-zinc-700 bg-zinc-800 font-mono text-white"
						/>
					</div>
				</div>
			</div>

			<!-- Endereço -->
			<div class="space-y-4 rounded-lg border border-zinc-800/50 bg-zinc-900/50 p-4">
				<div class="flex items-center gap-2 text-lg font-semibold text-orange-400">
					<MapPin class="h-5 w-5" />
					Endereço
				</div>

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="cep" class="text-sm font-medium text-zinc-300">CEP</Label>
						<Input
							id="cep"
							name="cep"
							value={usuario.cep || ''}
							placeholder="00000-000"
							maxlength={9}
							class="border-zinc-700 bg-zinc-800 text-white"
						/>
					</div>

					<div class="space-y-2">
						<Label for="numeroCasa" class="text-sm font-medium text-zinc-300">Número</Label>
						<Input
							id="numeroCasa"
							name="numeroCasa"
							type="number"
							value={usuario.numeroCasa || ''}
							placeholder="123"
							class="border-zinc-700 bg-zinc-800 text-white"
						/>
					</div>
				</div>

				<div class="space-y-2">
					<Label for="rua" class="text-sm font-medium text-zinc-300">Rua/Logradouro</Label>
					<Input
						id="rua"
						name="rua"
						value={usuario.rua || ''}
						placeholder="Nome da rua, avenida, etc."
						maxlength={256}
						class="border-zinc-700 bg-zinc-800 text-white"
					/>
				</div>

				<div class="space-y-2">
					<Label for="complemento" class="text-sm font-medium text-zinc-300">
						Complemento (opcional)
					</Label>
					<Input
						id="complemento"
						name="complemento"
						value={usuario.complemento || ''}
						placeholder="Apartamento, bloco, etc."
						maxlength={256}
						class="border-zinc-700 bg-zinc-800 text-white"
					/>
				</div>

				<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
					<div class="space-y-2">
						<Label for="bairro" class="text-sm font-medium text-zinc-300">Bairro</Label>
						<Input
							id="bairro"
							name="bairro"
							value={usuario.bairro || ''}
							placeholder="Nome do bairro"
							maxlength={256}
							class="border-zinc-700 bg-zinc-800 text-white"
						/>
					</div>

					<div class="space-y-2">
						<Label for="cidade" class="text-sm font-medium text-zinc-300">Cidade</Label>
						<Input
							id="cidade"
							name="cidade"
							value={usuario.cidade || ''}
							placeholder="Nome da cidade"
							maxlength={256}
							class="border-zinc-700 bg-zinc-800 text-white"
						/>
					</div>

					<div class="space-y-2">
						<Label for="estado" class="text-sm font-medium text-zinc-300">Estado</Label>
						<Input
							id="estado"
							name="estado"
							value={usuario.estado || ''}
							placeholder="SP"
							maxlength={2}
							class="border-zinc-700 bg-zinc-800 text-white uppercase"
						/>
					</div>
				</div>
			</div>

			<!-- Informações Financeiras -->
			<div class="space-y-4 rounded-lg border border-emerald-800/50 bg-emerald-900/20 p-4">
				<div class="flex items-center gap-2 text-lg font-semibold text-emerald-400">
					<DollarSign class="h-5 w-5" />
					Informações Financeiras
				</div>

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="bonusIndicacao" class="text-sm font-medium text-zinc-300">
							Bônus de Indicação (R$)
						</Label>
						<Input
							id="bonusIndicacao"
							name="bonusIndicacao"
							type="number"
							min="0"
							step="0.01"
							value={usuario.bonusIndicacao || 0}
							placeholder="0.00"
							class="border-zinc-700 bg-zinc-800 text-white"
						/>
					</div>

					<div class="space-y-2">
						<Label for="bonusIndicacaoResgatado" class="text-sm font-medium text-zinc-300">
							Bônus Resgatado (R$)
						</Label>
						<Input
							id="bonusIndicacaoResgatado"
							name="bonusIndicacaoResgatado"
							type="number"
							min="0"
							step="0.01"
							value={usuario.bonusIndicacaoResgatado || 0}
							placeholder="0.00"
							class="border-zinc-700 bg-zinc-800 text-white"
						/>
					</div>
				</div>
			</div>
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
