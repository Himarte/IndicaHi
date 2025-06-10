<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Label } from '$lib/components/ui/label/index.js';
	import type { ActionData, PageData } from './$types';
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';
	import type { User } from '$lib/server/auth';
	import { maskCPF, maskCNPJ } from '$lib/uteis/masks';

	interface Props {
		data: PageData;
		form: ActionData;
		onfoo?: () => void; // Example of callback prop usage
	}

	let { data, form, onfoo }: Props = $props();

	const userProfile: User | null = $state(data.user);

	let selectedPixType = $state(userProfile?.pixType || '');
	let pixCode = $state('');
	let isSubmitting = $state(false);

	// Estados para controlar os dados salvos (para mostrar a chave atual)
	let savedPixType = $state(userProfile?.pixType || '');
	let savedPixCode = $state(userProfile?.pixCode || '');

	// Inicializar o código PIX com máscara se existir
	$effect(() => {
		if (userProfile?.pixCode && userProfile?.pixType) {
			if (userProfile.pixType === 'cpf') {
				pixCode = maskCPF(userProfile.pixCode);
			} else if (userProfile.pixType === 'cnpj') {
				pixCode = maskCNPJ(userProfile.pixCode);
			} else {
				pixCode = userProfile.pixCode;
			}
			// Inicializar os dados salvos
			savedPixType = userProfile.pixType;
			savedPixCode = userProfile.pixCode;
		}
	});

	const pixTypes = [
		{ value: 'cpf', label: 'CPF' },
		{ value: 'cnpj', label: 'CNPJ' }
	];

	// Função para aplicar máscara conforme o tipo selecionado
	function handlePixCodeInput(event: Event) {
		const target = event.target as HTMLInputElement;
		let value = target.value;

		if (selectedPixType === 'cpf') {
			pixCode = maskCPF(value);
		} else if (selectedPixType === 'cnpj') {
			pixCode = maskCNPJ(value);
		} else {
			pixCode = value;
		}
	}

	// Limpar campo quando mudar o tipo
	function handlePixTypeChange() {
		pixCode = '';
	}

	// Validações
	function validatePixCode(): boolean {
		if (!pixCode.trim()) return false;

		if (selectedPixType === 'cpf') {
			const cleanCode = pixCode.replace(/\D/g, '');
			return cleanCode.length === 11;
		} else if (selectedPixType === 'cnpj') {
			const cleanCode = pixCode.replace(/\D/g, '');
			return cleanCode.length === 14;
		}

		return false;
	}

	// Controla o placeholder dinâmico
	const placeholderText = $derived.by(() => {
		if (!selectedPixType) return 'Selecione um tipo de chave PIX';
		if (selectedPixType === 'cpf') return '000.000.000-00';
		if (selectedPixType === 'cnpj') return '00.000.000/0000-00';
		return '';
	});

	// Verifica se os dados foram alterados
	const hasChanges = $derived.by(() => {
		const currentCleanCode = pixCode.replace(/\D/g, '');
		return selectedPixType !== savedPixType || currentCleanCode !== savedPixCode;
	});

	// Dados para exibir na seção "Chave PIX atual"
	const currentDisplayData = $derived.by(() => {
		// Se tem mudanças pendentes, mostra os dados do formulário
		if (hasChanges && selectedPixType && pixCode && validatePixCode()) {
			return {
				type: selectedPixType,
				code: pixCode,
				isModified: true
			};
		}
		// Senão, mostra os dados salvos
		if (savedPixType && savedPixCode) {
			const formattedCode = savedPixType === 'cpf' ? maskCPF(savedPixCode) :
								  savedPixType === 'cnpj' ? maskCNPJ(savedPixCode) :
								  savedPixCode;
			return {
				type: savedPixType,
				code: formattedCode,
				isModified: false
			};
		}
		return null;
	});

	// Gerenciar toasts de resposta e atualizar dados salvos
	$effect(() => {
		if (form?.message) {
			if (form?.status === 400 || form?.status === 500) {
				toast.error(form.message, { duration: 3500 });
			} else if (form.status === 200) {
				toast.success(form.message, { duration: 3500 });
				// Atualizar os dados salvos após sucesso
				savedPixType = selectedPixType;
				savedPixCode = pixCode.replace(/\D/g, '');
			} else {
				toast.error('Erro desconhecido, entre em contato com o suporte', {
					duration: 3500
				});
			}
		}
	});
</script>

<form
	method="post"
	action="?/editarDadosPix"
	use:enhance={({ formData }) => {
		isSubmitting = true;
		// Garantir que o pixType seja enviado corretamente
		formData.set('pixType', selectedPixType);

		return async ({ update }) => {
			isSubmitting = false;
			update();
		};
	}}
>
	<Card.Root class="w-full border border-zinc-700/50 bg-zinc-900/40">
		<Card.Header>
			<Card.Title class="text-lg sm:text-xl">Dados para pagamentos via Pix</Card.Title>
			<Card.Description class="text-sm sm:text-base"
				>Configure suas informações de pagamento PIX.</Card.Description
			>
		</Card.Header>
		<Card.Content class="flex w-full flex-col gap-4 sm:gap-5">
			<!-- Layout responsivo: vertical no mobile, horizontal no desktop -->
			<div class="flex w-full flex-col gap-4 lg:flex-row lg:items-start lg:gap-5">
				<div class="flex w-full flex-col gap-2 lg:w-1/3">
					<Label class="text-sm font-medium">Tipo de Chave</Label>
					<RadioGroup.Root bind:value={selectedPixType} onValueChange={handlePixTypeChange}>
						<div class="flex flex-col gap-3 sm:flex-row sm:gap-4 lg:flex-col lg:gap-3">
							{#each pixTypes as type}
								<div class="flex items-center space-x-2">
									<RadioGroup.Item value={type.value} id={type.value} />
									<input type="hidden" name="pixType" value={selectedPixType} />
									<Label for={type.value} class="cursor-pointer text-sm">{type.label}</Label>
								</div>
							{/each}
						</div>
					</RadioGroup.Root>
				</div>

				<div class="flex w-full flex-col gap-2 lg:w-2/3">
					<Label for="pixCode" class="text-sm font-medium">Chave Pix</Label>
					<Input
						id="pixCode"
						name="pixCode"
						bind:value={pixCode}
						placeholder={placeholderText}
						disabled={!selectedPixType}
						oninput={handlePixCodeInput}
						maxlength={selectedPixType === 'cpf' ? 14 : selectedPixType === 'cnpj' ? 18 : undefined}
						class={`text-sm ${!selectedPixType ? 'bg-muted' : validatePixCode() || !pixCode ? '' : 'border-destructive'}`}
					/>
					{#if selectedPixType && pixCode && !validatePixCode()}
						<span class="text-destructive text-xs">
							{selectedPixType === 'cpf' ? 'CPF deve ter 11 dígitos' : 'CNPJ deve ter 14 dígitos'}
						</span>
					{/if}
				</div>
			</div>
		</Card.Content>

		<Card.Footer class="flex items-center justify-end px-4  sm:px-6">
			<Button
				class="h-8 px-4 text-sm sm:h-9 sm:px-6"
				type="submit"
				disabled={isSubmitting || !selectedPixType || !pixCode || !validatePixCode()}
			>
				{isSubmitting ? 'Salvando...' : hasChanges ? 'Salvar Alterações' : 'Salvar'}
			</Button>
		</Card.Footer>
	</Card.Root>
</form>
