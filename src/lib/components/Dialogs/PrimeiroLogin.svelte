<script lang="ts">
	import type { User } from '$lib/server/auth';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '../ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { toast } from 'svelte-sonner';
	import {
		applyMask,
		formatarTelefone,
		formatarCep,
		cleanCPF,
		cleanCellPhone
	} from '$lib/uteis/masks';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Skeleton } from '$lib/components/ui/skeleton';

	export let userData: User;

	// Constantes e tipos
	const pixTypes = [
		{ value: 'cpf', label: 'CPF' },
		{ value: 'cnpj', label: 'CNPJ' }
	];

	// Estado do formulário
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
	let formValido = false;
	let submitting = false;

	// Validações
	let erros = {
		cpf: '',
		celular: '',
		pixCode: '',
		numero: '',
		cep: ''
	};

	// Função para buscar CEP
	const buscarCep = async (cepLimpo: string) => {
		if (cepLimpo.length !== 8) return;

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
				numero: endereco.numero || ''
			};

			toast.success('CEP encontrado');

			// Foca no campo de número após um pequeno delay
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

	// Função para validar formulário - otimizada
	$: formValido = Boolean(
		!erros.cpf &&
			!erros.celular &&
			!erros.pixCode &&
			!erros.numero &&
			promoCodeValid &&
			cpf &&
			celular &&
			pixCode &&
			selectedPixType &&
			cep &&
			endereco.rua &&
			endereco.bairro &&
			endereco.cidade &&
			endereco.estado
	);

	// Validação de CPF
	$: {
		if (cpf) {
			const cpfLimpo = cleanCPF(cpf);
			erros.cpf = cpfLimpo.length !== 11 ? 'CPF deve ter 11 dígitos' : '';
		} else {
			erros.cpf = '';
		}
	}

	// Validação de celular
	$: {
		if (celular) {
			const celularLimpo = cleanCellPhone(celular);
			erros.celular =
				celularLimpo.length < 10 || celularLimpo.length > 11
					? 'Celular deve ter entre 10 e 11 dígitos'
					: '';
		} else {
			erros.celular = '';
		}
	}

	// Validação de PIX
	$: {
		if (pixCode && selectedPixType) {
			if (selectedPixType === 'cpf') {
				erros.pixCode = cleanCPF(pixCode).length !== 11 ? 'CPF deve ter 11 dígitos' : '';
			} else if (selectedPixType === 'cnpj') {
				erros.pixCode = cleanCPF(pixCode).length !== 14 ? 'CNPJ deve ter 14 dígitos' : '';
			} else {
				erros.pixCode = '';
			}
		} else {
			erros.pixCode = '';
		}
	}

	// Validação de CEP
	$: {
		if (cep) {
			const cepLimpo = cep.replace(/\D/g, '');
			erros.cep = cepLimpo.length !== 8 ? 'CEP deve ter 8 dígitos' : '';
		} else {
			erros.cep = '';
		}
	}

	// Validação de número
	$: {
		if (endereco.numero) {
			const numero = parseInt(endereco.numero);
			erros.numero = isNaN(numero) || numero <= 0 ? 'Digite um número válido' : '';
		} else {
			erros.numero = '';
		}
	}

	// Aplicar máscara conforme o tipo de PIX selecionado
	$: if (pixCode && selectedPixType) {
		pixCode = applyMask(pixCode, selectedPixType);
	}

	// Buscar CEP quando completo
	$: {
		if (cep) {
			const cepLimpo = cep.replace(/\D/g, '');
			if (cepLimpo.length === 8 && cepLimpo !== ultimoCepConsultado) {
				ultimoCepConsultado = cepLimpo;
				buscarCep(cepLimpo);
			}
		}
	}

	// Verificar código promocional
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

	// Enviar formulário
	const submitDadosCadastro = async (event: Event) => {
		event.preventDefault();

		if (submitting) return;
		submitting = true;

		if (!selectedPixType) {
			toast.error('Selecione um tipo de PIX');
			submitting = false;
			return;
		}

		if (!pixCode) {
			toast.error('Informe uma chave PIX');
			submitting = false;
			return;
		}

		// Validar todos os campos obrigatórios
		if (!formValido) {
			toast.error('Preencha todos os campos obrigatórios corretamente');
			submitting = false;
			return;
		}

		const formData = new FormData(event.target as HTMLFormElement);

		// Adiciona os dados que podem não estar sendo capturados pelo FormData
		formData.append('userId', userData.id);
		formData.append('pixType', selectedPixType);

		// Adiciona dados de endereço
		formData.append('cep', cep.replace(/\D/g, ''));
		formData.append('rua', endereco.rua);
		formData.append('numero', endereco.numero);
		formData.append('complemento', endereco.complemento || '');
		formData.append('bairro', endereco.bairro);
		formData.append('cidade', endereco.cidade);
		formData.append('estado', endereco.estado);

		// Adiciona os dados limpos para facilitar a validação no servidor
		formData.append('celularLimpo', cleanCellPhone(celular));
		formData.append('cpfLimpo', cleanCPF(cpf));

		try {
			const response = await fetch('/api/perfil/cadastroPrimeiroLogin', {
				method: 'POST',
				body: formData
			});
			const result = await response.json();

			if (response.status === 200) {
				toast.success(result.message);
				setTimeout(() => location.reload(), 1000);
			} else {
				toast.warning(result.message);
			}
		} catch (error) {
			toast.error('Erro ao cadastrar dados');
			console.error(error);
		} finally {
			submitting = false;
		}
	};
</script>

<form
	onsubmit={submitDadosCadastro}
	class="bg-background absolute top-0 left-0 z-50 flex h-fit w-full items-center justify-center p-4 md:h-full"
>
	<Card.Root class="flex h-fit w-full flex-col gap-4 md:w-2/5 md:p-6">
		<Card.Header class="text-center">
			<Card.Title class="text-2xl text-orange-500">Bem vindo!</Card.Title>
			<Card.Description>
				Preencha os campos abaixo para criarmos seu perfil e código de indicação, para que você
				possa começar a lucrar com as suas indicações!
			</Card.Description>
		</Card.Header>

		<Card.Content class="flex h-full flex-col gap-4">
			<!-- Dados pessoais -->
			<div class="flex flex-col gap-4 md:flex-row">
				<div class="flex flex-1 flex-col gap-2">
					<Label for="cpf">CPF do Usuário</Label>
					<Input
						type="text"
						id="cpf"
						name="cpf"
						placeholder="CPF"
						maxlength={14}
						bind:value={cpf}
						oninput={() => (cpf = applyMask(cpf, 'cpf'))}
						required
						class={erros.cpf ? 'border-red-500' : ''}
						aria-invalid={!!erros.cpf}
						aria-describedby={erros.cpf ? 'cpf-error' : 'cpf-hint'}
					/>
					{#if erros.cpf}
						<p id="cpf-error" class="text-xs text-red-500">{erros.cpf}</p>
					{:else}
						<p id="cpf-hint" class="text-muted-foreground text-xs">Ex. 123.456.789-10</p>
					{/if}
				</div>
				<div class="flex flex-1 flex-col gap-2">
					<Label for="celular">Celular</Label>
					<Input
						type="text"
						id="celular"
						name="celular"
						placeholder="Celular"
						maxlength={15}
						bind:value={celular}
						oninput={() => (celular = formatarTelefone(celular))}
						required
						class={erros.celular ? 'border-red-500' : ''}
						aria-invalid={!!erros.celular}
						aria-describedby={erros.celular ? 'celular-error' : 'celular-hint'}
					/>
					{#if erros.celular}
						<p id="celular-error" class="text-xs text-red-500">{erros.celular}</p>
					{:else}
						<p id="celular-hint" class="text-muted-foreground text-xs">Ex. (DD) 99999-9999</p>
					{/if}
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
								id="pixCode"
								name="pixCode"
								placeholder="Digite sua chave PIX"
								bind:value={pixCode}
								disabled={!selectedPixType}
								required
								class={erros.pixCode ? 'border-red-500' : ''}
								aria-invalid={!!erros.pixCode}
								aria-describedby={erros.pixCode ? 'pix-error' : 'pix-hint'}
							/>
							{#if erros.pixCode}
								<p id="pix-error" class="text-xs text-red-500">{erros.pixCode}</p>
							{:else}
								<p id="pix-hint" class="text-muted-foreground text-xs">
									{#if selectedPixType === 'cpf'}
										Ex. 123.456.789-10
									{:else}
										Ex. 12.345.678/0001-90
									{/if}
								</p>
							{/if}
						</div>
					{/if}
				</div>
				<div class="mt-3 flex flex-col gap-2 md:mt-0 md:w-1/2">
					<Label for="cep">Digite seu CEP</Label>
					<Input
						type="text"
						id="cep"
						name="cep"
						placeholder="Digite seu CEP"
						maxlength={9}
						autocomplete="postal-code"
						bind:value={cep}
						oninput={() => {
							cep = formatarCep(cep);
						}}
						required
						class={erros.cep ? 'border-red-500' : ''}
						aria-invalid={!!erros.cep}
						aria-describedby={erros.cep ? 'cep-error' : 'cep-hint'}
					/>
					{#if erros.cep}
						<p id="cep-error" class="text-xs text-red-500">{erros.cep}</p>
					{:else}
						<p id="cep-hint" class="text-muted-foreground text-xs">Ex. 12345-678</p>
					{/if}
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
								<Label for="rua">Rua</Label>
								<Input
									type="text"
									id="rua"
									name="rua"
									placeholder="Digite sua rua"
									bind:value={endereco.rua}
									maxlength={256}
									required
									autocomplete="street-address"
								/>
							</div>
							<div class="flex flex-col gap-2 md:w-1/3">
								<Label for="bairro">Bairro</Label>
								<Input
									type="text"
									id="bairro"
									name="bairro"
									placeholder="Digite seu bairro"
									bind:value={endereco.bairro}
									maxlength={256}
									required
								/>
							</div>
							<div class="flex flex-col gap-2 md:w-1/6">
								<Label for="estado">Estado</Label>
								<Input
									type="text"
									id="estado"
									name="estado"
									placeholder="ex. SP"
									bind:value={endereco.estado}
									maxlength={2}
									minlength={2}
									required
									autocomplete="address-level1"
								/>
							</div>
						</div>
						<div class="flex flex-col gap-4 md:flex-row">
							<div class="flex flex-1 flex-col gap-2">
								<Label for="cidade">Cidade</Label>
								<Input
									type="text"
									id="cidade"
									name="cidade"
									placeholder="Digite sua cidade"
									bind:value={endereco.cidade}
									maxlength={256}
									required
									autocomplete="address-level2"
								/>
							</div>
							<div class="flex flex-col gap-2 md:w-1/3">
								<Label for="complemento">Complemento</Label>
								<Input
									type="text"
									id="complemento"
									name="complemento"
									placeholder="Opcional"
									maxlength={256}
								/>
							</div>
							<div class="flex flex-col gap-2 md:w-1/6">
								<Label for="numero">Número</Label>
								<Input
									type="number"
									id="numero"
									name="numero"
									placeholder="ex. 123"
									bind:value={endereco.numero}
									min="1"
									maxlength={8}
									class={erros.numero ? '!appearance-none border-red-500' : '!appearance-none'}
									required
									aria-invalid={!!erros.numero}
									aria-describedby={erros.numero ? 'numero-error' : null}
								/>
								{#if erros.numero}
									<p id="numero-error" class="text-xs text-red-500">{erros.numero}</p>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Código promocional -->
			<div class="flex flex-col gap-4">
				<div class="mt-4 flex items-center gap-2">
					<p class="font-medium whitespace-nowrap">Código Promocional</p>
					<Separator class="flex-1" />
				</div>
				<p class="text-xs text-gray-400">
					Cadastre aqui seu código promocional e comece a lucrar com as suas indicações!
				</p>
				<div class="flex flex-col gap-4 md:flex-row md:items-center">
					<Input
						class="w-full md:flex-1"
						type="text"
						id="promoCode"
						bind:value={promoCode}
						name="promoCode"
						required
						maxlength={15}
						minlength={3}
						placeholder="Seu Código Promocional"
					/>
					<Button
						variant="secondary"
						onclick={handlePromoCodeSubmission}
						class="w-full md:w-auto"
						type="button"
						disabled={!promoCode || promoCode.length < 3}
					>
						Verificar
					</Button>
				</div>
			</div>
		</Card.Content>

		<Card.Footer class="flex justify-end">
			<Button type="submit" variant="secondary" disabled={!formValido || submitting}>
				{submitting ? 'Enviando...' : 'Continuar'}
			</Button>
		</Card.Footer>
	</Card.Root>
</form>
