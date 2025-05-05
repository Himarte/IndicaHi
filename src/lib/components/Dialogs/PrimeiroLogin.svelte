<script lang="ts">
	import type { userDataFromCookies } from '$lib/server/lucia.server';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '../ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { toast } from 'svelte-sonner';
	import { applyMask, formatarTelefone, formatarCep } from '$lib/uteis/masks';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Skeleton } from '$lib/components/ui/skeleton';

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
	let cep = '';
	let ultimoCepConsultado = '';
	let endereco = {
		rua: '',
		bairro: '',
		cidade: '',
		estado: '',
		complemento: '',
		numero: ''
	};
	let buscandoCep = false;
	let cepDigitado = false;

	// Função para aplicar máscara conforme o tipo de PIX selecionado
	$: if (pixCode && selectedPixType) {
		pixCode = applyMask(pixCode, selectedPixType);
	}

	$: {
		// React automaticamente quando o CEP é digitado
		if (cep) {
			const cepLimpo = cep.replace(/\D/g, '');
			if (cepLimpo.length === 8 && cepLimpo !== ultimoCepConsultado) {
				ultimoCepConsultado = cepLimpo;
				buscarCep(cepLimpo);
			}
		}
	}

	const buscarCep = async (cepLimpo: string) => {
		if (cepLimpo.length !== 8) {
			return;
		}

		cepDigitado = true;
		buscandoCep = true;

		try {
			const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);

			if (!response.ok) {
				throw new Error('Erro ao buscar CEP');
			}

			const data = await response.json();

			if (data.erro) {
				toast.error('CEP não encontrado');
				return;
			}

			endereco = {
				rua: data.logradouro || '',
				bairro: data.bairro || '',
				cidade: data.localidade || '',
				estado: data.uf || '',
				complemento: data.complemento || '',
				numero: ''
			};

			toast.success('CEP encontrado');

			// Foca no campo de número após um pequeno delay para garantir que o DOM foi atualizado
			setTimeout(() => {
				const inputNumero = document.querySelector('input[name="numero"]') as HTMLInputElement;
				if (inputNumero) inputNumero.focus();
			}, 100);
		} catch (error) {
			toast.error('Erro ao buscar CEP');
			console.error(error);
		} finally {
			buscandoCep = false;
		}
	};

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
	class="absolute left-0 top-0 z-50 flex h-fit w-full items-center justify-center bg-background p-4 md:h-full"
>
	<Card.Root class="flex h-fit w-full flex-col gap-4 md:w-2/5 md:p-6">
		<Card.Header class="text-center">
			<Card.Title class="text-2xl text-orange-500">Bem vindo!</Card.Title>
			<Card.Description>Preencha algumas informações para podermos continuar</Card.Description>
		</Card.Header>

		<Card.Content class="flex h-full flex-col gap-4">
			<!-- Dados pessoais -->
			<div class="flex flex-col gap-4 md:flex-row">
				<div class="flex flex-1 flex-col gap-2">
					<Label>CPF do Usuário</Label>
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
				<div class="flex flex-1 flex-col gap-2">
					<Label>Celular</Label>
					<Input
						type="text"
						name="celular"
						placeholder="Celular"
						maxlength={15}
						bind:value={celular}
						on:input={() => (celular = formatarTelefone(celular))}
						required
					/>
					<p class="text-xs text-muted-foreground">Ex. (DD) 99999-9999</p>
				</div>
			</div>

			<!-- PIX e CEP -->
			<div class="flex flex-col gap-5 md:flex-row md:gap-4">
				<div class="flex flex-1 flex-col gap-2">
					<Label>Chave PIX para recebimento</Label>
					<RadioGroup.Root
						bind:value={selectedPixType}
						class="flex flex-col gap-2 md:flex-row md:gap-4"
					>
						{#each pixTypes as type}
							<div class="flex items-center gap-2">
								<RadioGroup.Item value={type.value} id={type.value} />
								<Label for={type.value}>{type.label}</Label>
							</div>
						{/each}
					</RadioGroup.Root>

					{#if selectedPixType}
						<div class="flex flex-col gap-2">
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
								{:else}
									Ex. 12.345.678/0001-90
								{/if}
							</p>
						</div>
					{/if}
				</div>
				<div class="flex flex-col gap-2 md:w-1/2">
					<Label>Digite seu CEP</Label>
					<Input
						type="text"
						name="cep"
						placeholder="Digite seu CEP"
						maxlength={9}
						autocomplete="off"
						bind:value={cep}
						on:input={() => {
							cep = formatarCep(cep);
						}}
					/>
					<p class="text-xs text-muted-foreground">Ex. 12345-678</p>
				</div>
			</div>

			<!-- Endereço -->
			{#if cepDigitado}
				<div class="flex flex-col gap-4 md:mt-2">
					{#if buscandoCep}
						<!-- Skeleton loading state -->
						<div class="flex flex-col gap-4 md:flex-row">
							<div class="flex flex-1 flex-col gap-2">
								<Label>Rua</Label>
								<Skeleton class="h-10 w-full" />
							</div>
							<div class="flex flex-col gap-2 md:w-1/3">
								<Label>Bairro</Label>
								<Skeleton class="h-10 w-full" />
							</div>
							<div class="flex flex-col gap-2 md:w-1/6">
								<Label>Estado</Label>
								<Skeleton class="h-10 w-full" />
							</div>
						</div>
						<div class="flex flex-col gap-4 md:flex-row">
							<div class="flex flex-1 flex-col gap-2">
								<Label>Cidade</Label>
								<Skeleton class="h-10 w-full" />
							</div>
							<div class="flex flex-col gap-2 md:w-1/3">
								<Label>Complemento</Label>
								<Skeleton class="h-10 w-full" />
							</div>
							<div class="flex flex-col gap-2 md:w-1/6">
								<Label>Número</Label>
								<Skeleton class="h-10 w-full" />
							</div>
						</div>
					{:else}
						<!-- Normal input fields -->
						<div class="flex flex-col gap-4 md:flex-row">
							<div class="flex flex-1 flex-col gap-2">
								<Label>Rua</Label>
								<Input
									type="text"
									name="rua"
									placeholder="Digite sua rua"
									bind:value={endereco.rua}
								/>
							</div>
							<div class="flex flex-col gap-2 md:w-1/3">
								<Label>Bairro</Label>
								<Input
									type="text"
									name="bairro"
									placeholder="Digite seu bairro"
									bind:value={endereco.bairro}
								/>
							</div>
							<div class="flex flex-col gap-2 md:w-1/6">
								<Label>Estado</Label>
								<Input
									type="text"
									name="estado"
									placeholder="ex. SP"
									bind:value={endereco.estado}
								/>
							</div>
						</div>
						<div class="flex flex-col gap-4 md:flex-row">
							<div class="flex flex-1 flex-col gap-2">
								<Label>Cidade</Label>
								<Input
									type="text"
									name="cidade"
									placeholder="Digite sua cidade"
									bind:value={endereco.cidade}
								/>
							</div>
							<div class="flex flex-col gap-2 md:w-1/3">
								<Label>Complemento</Label>
								<Input type="text" name="complemento" placeholder="Opcional" />
							</div>
							<div class="flex flex-col gap-2 md:w-1/6">
								<Label>Número</Label>
								<Input
									type="text"
									name="numero"
									placeholder="ex. 123"
									id="numero-input"
									bind:value={endereco.numero}
								/>
							</div>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Código promocional -->
			<div class="flex flex-col gap-4">
				<div class="mt-4 flex items-center gap-2">
					<p class="whitespace-nowrap font-medium">Código Promocional</p>
					<Separator class="flex-1" />
				</div>
				<p class="text-xs text-gray-400">
					Cadastre aqui seu código promocional e comece a lucrar com as suas indicações!
				</p>
				<div class="flex flex-col gap-4 md:flex-row md:items-center">
					<Input
						class="w-full md:flex-1"
						type="text"
						bind:value={promoCode}
						name="promoCode"
						required
						maxlength={15}
						minlength={3}
						placeholder="Seu Código Promocional"
					/>
					<Button variant="secondary" on:click={handlePromoCodeSubmission} class="w-full md:w-auto">
						Verificar
					</Button>
				</div>
			</div>
		</Card.Content>

		<Card.Footer class="flex justify-end">
			<Button type="submit" variant="secondary" disabled={!promoCodeValid}>Continuar</Button>
		</Card.Footer>
	</Card.Root>
</form>
