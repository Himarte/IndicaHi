<script lang="ts">
	import type { userDataFromCookies } from '$lib/server/lucia.server';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '../ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { toast } from 'svelte-sonner';
	import { applyMask } from '$lib/uteis/masks';
	import * as RadioGroup from '$lib/components/ui/radio-group';

	export let userData: userDataFromCookies;

	const pixTypes = [
		{ value: 'cpf', label: 'CPF' },
		{ value: 'cnpj', label: 'CNPJ' }
	];

	let promoCode = '';
	let promoCodeValid = false;
	let cpf = '';
	let celular = '';
	let pixCode = '';
	let selectedPixType = '';

	// Função para aplicar máscara conforme o tipo de PIX selecionado
	$: if (pixCode && selectedPixType) {
		pixCode = applyMask(pixCode, selectedPixType);
	}

	const handlePromoCodeSubmission = async (event: Event) => {
		event.preventDefault();

		if (!promoCode || promoCode.length < 3) {
			toast.error('Código promocional deve ter no mínimo 3 caracteres');
			return;
		}

		const formData = new FormData();
		formData.append('promoCode', promoCode);

		try {
			const response = await fetch('/api/perfil/checarPromoCode', {
				method: 'POST',
				body: formData
			});

			if (response.status === 200) {
				toast.success('Código promocional válido');
				promoCodeValid = true;
			} else {
				const data = await response.json();
				toast.warning(data.message || 'Código promocional inválido');
				promoCodeValid = false;
			}
		} catch (error) {
			console.error('Error:', error);
			toast.error('Erro ao verificar código promocional');
			promoCodeValid = false;
		}
	};

	const submitDadosCadastro = async (event: Event) => {
		event.preventDefault();

		if (!selectedPixType) {
			toast.error('Selecione um tipo de PIX');
			return;
		}

		if (!pixCode) {
			toast.error('Informe uma chave PIX');
			return;
		}

		const formData = new FormData(event.target as HTMLFormElement);
		formData.append('userId', userData.id);
		formData.append('pixType', selectedPixType);

		try {
			const response = await fetch('/api/perfil/cadastroPrimeiroLogin', {
				method: 'POST',
				body: formData
			});
			const result = await response.json();

			if (response.status === 200) {
				location.reload();
				toast.success(result.message);
			} else {
				toast.warning(result.message);
			}
		} catch (error) {
			toast.error('Erro ao cadastrar dados');
		}
	};
</script>

<form
	on:submit={submitDadosCadastro}
	class="absolute z-20 flex h-full w-full items-center justify-center bg-primary-foreground/90"
>
	<Card.Root class="flex w-1/3 flex-col px-5">
		<Card.Header class="text-center">
			<Card.Title class="text-2xl">Bem vindo!</Card.Title>
			<Card.Description class="text-md">
				Preencha algumas informações para podermos continuar
			</Card.Description>
		</Card.Header>

		<Card.Content class="flex h-full w-full flex-col gap-5">
			<div class="flex w-full flex-col gap-5">
				<div class="flex items-center justify-between">
					<Separator class="flex w-1/3 gap-2" />
					<p>Dados pessoais</p>
					<Separator class="flex w-1/3" />
				</div>

				<div class="flex w-full gap-5">
					<div class="flex w-full flex-col gap-1.5">
						<Input
							type="text"
							name="cpf"
							placeholder="CPF"
							maxlength={14}
							bind:value={cpf}
							on:input={() => (cpf = applyMask(cpf, 'cpf'))}
							required
						/>
						<p class="text-xs text-muted-foreground">Ex. 123.456.789-10</p>
					</div>
					<div class="flex w-full flex-col gap-1.5">
						<Input
							type="text"
							name="celular"
							placeholder="Celular"
							maxlength={15}
							bind:value={celular}
							on:input={() => (celular = applyMask(celular, 'celular'))}
							required
						/>
						<p class="text-xs text-muted-foreground">Ex. (DD) 99999-9999</p>
					</div>
				</div>
			</div>

			<div class="flex w-full flex-col gap-5">
				<div class="flex w-full gap-5">
					<div class="flex w-full flex-col gap-1.5">
						<Label class="pb-1">Tipo de Chave PIX</Label>
						<RadioGroup.Root bind:value={selectedPixType}>
							{#each pixTypes as type}
								<div class="flex items-center space-x-2">
									<RadioGroup.Item value={type.value} id={type.value}></RadioGroup.Item>
									<Label for={type.value}>{type.label}</Label>
								</div>
							{/each}
						</RadioGroup.Root>
					</div>
					<div class="flex w-full flex-col gap-1.5">
						<Label class="pb-1">Chave PIX</Label>
						<Input
							type="text"
							name="pixCode"
							placeholder="Digite sua chave PIX"
							bind:value={pixCode}
							disabled={!selectedPixType}
							required
						/>
						<p class="text-xs text-muted-foreground">
							{#if selectedPixType === 'cpf'}
								Ex. 123.456.789-10
							{:else if selectedPixType === 'cnpj'}
								Ex. 12.345.678/0001-90
							{:else}
								Selecione um tipo de chave PIX
							{/if}
						</p>
					</div>
				</div>
			</div>

			<div class="items mt-5 flex w-full items-center justify-between">
				<p class="w-1/3 whitespace-nowrap">Código Promocional</p>
				<Separator class="flex w-2/3" />
			</div>

			<p class="text-xs text-gray-400">
				Cadastre aqui seu código promocional e comece a lucrar com as suas indicações!
			</p>

			<div class="flex w-full flex-col gap-2">
				<div class="flex w-[63%] gap-2">
					<Input
						type="text"
						bind:value={promoCode}
						name="promoCode"
						required
						maxlength={15}
						minlength={3}
						placeholder="Seu Código Promocional"
					/>
					<Button variant="secondary" on:click={handlePromoCodeSubmission}>Verificar</Button>
				</div>
			</div>
		</Card.Content>

		<Card.Footer class="flex w-full justify-end">
			<Button type="submit" variant="secondary" disabled={!promoCodeValid}>Continuar</Button>
		</Card.Footer>
	</Card.Root>
</form>
