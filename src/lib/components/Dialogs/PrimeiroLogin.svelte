<script lang="ts">
	import type { userDataFromCookies } from '$lib/server/lucia.server';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '../ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { toast } from 'svelte-sonner';
	import { applyMask } from '$lib/uteis/masks';

	export let userData: userDataFromCookies;

	const pixTypes = [
		{ value: 'cpf', label: 'CPF' },
		{ value: 'cnpj', label: 'CNPJ' },
		{ value: 'email', label: 'E-mail' },
		{ value: 'celular', label: 'Celular' }
	];

	let promoCode = '';
	let promoCodeValid = false;
	let cpf = '';
	let celular = '';
	let selectedPixType = '';
	let pixCode = '';

	function handlePixCodeInput() {
		if (!selectedPixType) return pixCode;

		switch (selectedPixType) {
			case 'cpf':
				pixCode = applyMask(pixCode, 'cpf');
				break;
			case 'cnpj':
				pixCode = applyMask(pixCode, 'cnpj');
				break;
			case 'celular':
				pixCode = applyMask(pixCode, 'celular');
				break;
			case 'email':
				// Email não precisa de máscara
				break;
		}
	}

	function getMaxLength(type: string): number {
		switch (type) {
			case 'cpf':
				return 14;
			case 'cnpj':
				return 18;
			case 'celular':
				return 15;
			case 'email':
				return 100;
			default:
				return 100;
		}
	}

	function getPlaceholder(type: string): string {
		switch (type) {
			case 'cpf':
				return 'Ex: 123.456.789-10';
			case 'cnpj':
				return 'Ex: 12.345.678/0001-90';
			case 'celular':
				return 'Ex: (11) 99999-9999';
			case 'email':
				return 'Ex: seu@email.com';
			default:
				return 'Chave PIX';
		}
	}

	const handlePromoCodeSubmission = async (event: Event) => {
		event.preventDefault();

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
				toast.warning('Código promocional inválido');
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
		const formData = new FormData(event.target as HTMLFormElement);
		formData.append('userId', userData.id);

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
			<Card.Description class="text-md"
				>Prencha algumas informações para podermos continuar</Card.Description
			>
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
						/>
						<p class="text-xs text-muted-foreground">Ex. (DD) 99999-9999</p>
					</div>
				</div>
			</div>
			<div class="flex w-full flex-col gap-5">
				<div class="flex w-full gap-5">
					<div class="flex w-full flex-col gap-1.5">
						<Select.Root bind:value={selectedPixType} portal={null}>
							<Select.Trigger class="w-full">
								<Select.Value placeholder="Tipo de chave" />
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									{#each pixTypes as pixType}
										<Select.Item value={pixType.value} label={pixType.label}>
											{pixType.label}
										</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
							<Select.Input name="pixType" />
						</Select.Root>
						<p class="text-xs text-muted-foreground">Ex. CPF</p>
					</div>
					<div class="flex w-full flex-col gap-1.5">
						<Input
							type={selectedPixType === 'email' ? 'email' : 'text'}
							name="pixCode"
							placeholder={getPlaceholder(selectedPixType)}
							bind:value={pixCode}
							on:input={handlePixCodeInput}
							maxlength={getMaxLength(selectedPixType)}
							required
						/>
						<p class="text-xs text-muted-foreground">{getPlaceholder(selectedPixType)}</p>
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
