<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button';
	import { maskCPF, maskCep } from '$lib/uteis/masks';
	import type { User } from '$lib/server/auth';
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Estados para os campos editáveis
	let cpfValue: string = $state(data.user?.cpf ? maskCPF(data.user.cpf) : '');
	let promoCodeValue: string = $state(data.user?.promoCode || '');
	let cepValue: string = $state(data.user?.cep ? maskCep(data.user.cep) : '');
	let ruaValue: string = $state(data.user?.rua || '');
	let numeroCasaValue: string = $state(data.user?.numeroCasa?.toString() || '');
	let complementoValue: string = $state(data.user?.complemento || '');
	let bairroValue: string = $state(data.user?.bairro || '');
	let cidadeValue: string = $state(data.user?.cidade || '');
	let estadoValue: string = $state(data.user?.estado || '');

	// Estados para loading
	let isSubmittingPersonal = $state(false);
	let isSubmittingLocation = $state(false);

	// Funções para aplicar máscaras
	function handleCpfInput(event: Event) {
		const target = event.target as HTMLInputElement;
		cpfValue = maskCPF(target.value);
	}

	function handleCepInput(event: Event) {
		const target = event.target as HTMLInputElement;
		cepValue = maskCep(target.value);
	}

	function handleEstadoInput(event: Event) {
		const target = event.target as HTMLInputElement;
		estadoValue = target.value.toUpperCase().slice(0, 2);
	}

	// Validações básicas no front-end
	function validateCpf(cpf: string): boolean {
		const cleanCpf = cpf.replace(/\D/g, '');
		return cleanCpf.length === 11;
	}

	function validateCep(cep: string): boolean {
		const cleanCep = cep.replace(/\D/g, '');
		return cleanCep.length === 8;
	}

	function validatePromoCode(code: string): boolean {
		return code.length <= 15;
	}

	let userProfile = data.user as User;
</script>

<!-- Formulário de Dados Pessoais -->
<form
	method="post"
	class="relative"
	use:enhance={() => {
		isSubmittingPersonal = true;
		return async ({ result, update }) => {
			isSubmittingPersonal = false;
			if (result.type === 'failure') {
				// @ts-ignore
				toast.error(result.data.message);
			} else {
				// @ts-ignore
				toast.success(result.data.message);
			}
			await update();
		};
	}}
>
	<Card.Root class="h-full w-full border border-zinc-700/50 bg-zinc-900/40">
		<Card.Header>
			<Card.Title class="text-lg sm:text-xl">Dados pessoais</Card.Title>
			<Card.Description class="text-sm sm:text-base"
				>Aqui estão suas informações básicas.</Card.Description
			>
		</Card.Header>
		<Card.Content class="flex w-full flex-col gap-4 sm:gap-5">
			<!-- Layout responsivo para nome e CPF -->
			<div class="flex w-full flex-col gap-4 sm:flex-row sm:gap-5">
				<div class="flex w-full flex-col gap-2 sm:w-1/2">
					<Label for="name" class="text-sm font-medium">Nome Completo</Label>
					<Input
						id="name"
						name="name"
						disabled
						value={data.user?.name || ''}
						class="bg-muted text-sm"
					/>
				</div>
				<div class="flex w-full flex-col gap-2 sm:w-1/2">
					<Label for="cpf" class="text-sm font-medium">CPF</Label>
					<Input
						id="cpf"
						name="cpf"
						placeholder="000.000.000-00"
						bind:value={cpfValue}
						oninput={handleCpfInput}
						minlength={14}
						maxlength={14}
						class={`text-sm ${validateCpf(cpfValue) || cpfValue === '' ? '' : 'border-destructive'}`}
					/>
					{#if cpfValue && !validateCpf(cpfValue)}
						<span class="text-destructive text-xs">CPF deve ter 11 dígitos</span>
					{/if}
				</div>
			</div>

			<!-- Layout responsivo para email e código promocional -->
			<div class="flex w-full flex-col gap-4 sm:flex-row sm:gap-5">
				<div class="flex w-full flex-col gap-2 sm:w-1/2">
					<Label for="email" class="text-sm font-medium">Email</Label>
					<Input
						id="email"
						name="email"
						disabled
						value={data.user?.email || ''}
						class="bg-muted text-sm"
					/>
				</div>
				<div class="flex w-full flex-col gap-2 sm:w-1/2">
					<Label for="promoCode" class="text-sm font-medium">Código promocional</Label>
					<Input
						id="promoCode"
						name="promoCode"
						placeholder="Máximo 15 caracteres"
						bind:value={promoCodeValue}
						maxlength={15}
						class={`text-sm ${validatePromoCode(promoCodeValue) ? '' : 'border-destructive'}`}
					/>
					{#if !validatePromoCode(promoCodeValue)}
						<span class="text-destructive text-xs">Máximo de 15 caracteres</span>
					{/if}
				</div>
			</div>
		</Card.Content>
		<Card.Footer class="flex items-center justify-end px-4 py-3 sm:px-6 sm:py-4">
			<Button
				class="h-8 px-4 text-sm sm:h-9 sm:px-6"
				type="submit"
				formaction="?/editarDadosPessoais"
				disabled={isSubmittingPersonal || (cpfValue && !validateCpf(cpfValue)) || !validatePromoCode(promoCodeValue)}
			>
				{isSubmittingPersonal ? 'Salvando...' : 'Salvar'}
			</Button>
		</Card.Footer>
	</Card.Root>
</form>

<!-- Formulário de Localização -->
<form
	method="post"
	use:enhance={() => {
		isSubmittingLocation = true;
		return async ({ result, update }) => {
			isSubmittingLocation = false;
			if (result.type === 'failure') {
				// @ts-ignore
				toast.error(result.data.message);
			} else {
				// @ts-ignore
				toast.success(result.data.message);
			}
			await update();
		};
	}}
	action="?/editarLocalizacao"
>
	<Card.Root class="mt-4 w-full border border-zinc-700/50 bg-zinc-900/40 sm:mt-5">
		<Card.Header>
			<Card.Title class="text-lg sm:text-xl">Localização</Card.Title>
			<Card.Description class="text-sm sm:text-base"
				>Aqui estão suas informações de localização.</Card.Description
			>
		</Card.Header>
		<Card.Content class="flex w-full flex-col gap-4 sm:gap-5">
			<!-- Primeira linha: CEP, Rua, Número, Complemento - Layout responsivo -->
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5">
				<div class="flex flex-col gap-2 sm:col-span-1 lg:col-span-3">
					<Label for="cep" class="text-sm font-medium">CEP</Label>
					<Input
						id="cep"
						name="cep"
						placeholder="00000-000"
						bind:value={cepValue}
						oninput={handleCepInput}
						minlength={9}
						maxlength={9}
						class={`text-sm ${validateCep(cepValue) || cepValue === '' ? '' : 'border-destructive'}`}
					/>
					{#if cepValue && !validateCep(cepValue)}
						<span class="text-destructive text-xs">CEP deve ter 8 dígitos</span>
					{/if}
				</div>
				<div class="flex flex-col gap-2 sm:col-span-1 lg:col-span-4">
					<Label for="rua" class="text-sm font-medium">Rua</Label>
					<Input
						id="rua"
						name="rua"
						placeholder="Nome da rua"
						bind:value={ruaValue}
						class="text-sm"
					/>
				</div>
				<div class="flex flex-col gap-2 sm:col-span-1 lg:col-span-2">
					<Label for="numeroCasa" class="text-sm font-medium">Número</Label>
					<Input
						id="numeroCasa"
						name="numeroCasa"
						placeholder="123"
						bind:value={numeroCasaValue}
						type="number"
						min="1"
						class="text-sm"
					/>
				</div>
				<div class="flex flex-col gap-2 sm:col-span-1 lg:col-span-3">
					<Label for="complemento" class="text-sm font-medium">Complemento</Label>
					<Input
						id="complemento"
						name="complemento"
						placeholder="Apt 313"
						bind:value={complementoValue}
						class="text-sm"
					/>
				</div>
			</div>

			<!-- Segunda linha: Bairro, Cidade, Estado - Layout responsivo -->
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5">
				<div class="flex flex-col gap-2 sm:col-span-1 lg:col-span-5">
					<Label for="bairro" class="text-sm font-medium">Bairro</Label>
					<Input
						id="bairro"
						name="bairro"
						placeholder="Nome do bairro"
						bind:value={bairroValue}
						class="text-sm"
					/>
				</div>
				<div class="flex flex-col gap-2 sm:col-span-1 lg:col-span-5">
					<Label for="cidade" class="text-sm font-medium">Cidade</Label>
					<Input
						id="cidade"
						name="cidade"
						placeholder="Nome da cidade"
						bind:value={cidadeValue}
						class="text-sm"
					/>
				</div>
				<div class="flex flex-col gap-2 sm:col-span-2 lg:col-span-2">
					<Label for="estado" class="text-sm font-medium">Estado</Label>
					<Input
						id="estado"
						name="estado"
						type="text"
						placeholder="SP"
						bind:value={estadoValue}
						oninput={handleEstadoInput}
						minlength={2}
						maxlength={2}
						class="text-sm uppercase"
					/>
				</div>
			</div>
		</Card.Content>
		<Card.Footer class="flex items-center justify-end px-4 py-3 sm:px-6 sm:py-4">
			<Button
				class="h-8 px-4 text-sm sm:h-9 sm:px-6"
				type="submit"
				formaction="?/editarLocalizacao"
				disabled={isSubmittingLocation || (cepValue !== '' && !validateCep(cepValue))}
			>
				{isSubmittingLocation ? 'Salvando...' : 'Salvar'}
			</Button>
		</Card.Footer>
	</Card.Root>
</form>
