<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { validationCpf } from '$lib/components/FormAuth/CreateUser/validation/functionsUteis';
	import { Circle3 } from 'svelte-loading-spinners';

	let cpfValue: string = '';
	function digitandoCpf(event: InputEvent) {
		const target = event.target as HTMLInputElement;
		cpfValue = validationCpf(target.value);
	}

	const pixTypes = [
		{ value: 'CPF', label: 'CPF' },
		{ value: 'CNPJ', label: 'CNPJ' },
		{ value: 'Email', label: 'Email' },
		{ value: 'Celular', label: 'Celular' }
	];

	const userProfile = data.dadosPerfilUser;
	// TODO: Alguns das sessoes nao estao verificando se os dados estao vazios e enviando eles vazios... precisa pegar o que esta de dwfault e enviar junto
</script>

<form action="?/editarDadosPessoais" method="post" class="relative">
	<Card.Root class="w-full ">
		<Card.Header>
			<Card.Title>Dados pessoas</Card.Title>
			<Card.Description>Aqui vai suas informações basicas.</Card.Description>
		</Card.Header>
		<Card.Content class="flex w-full flex-col items-center gap-5">
			<div class="flex w-full items-center gap-5">
				<div class="flex w-1/2 flex-col gap-2">
					<Label for="name">Name</Label>
					<Input id="name" name="name" placeholder={data.user?.name} />
				</div>
				<div class="flex w-1/2 flex-col gap-2">
					<Label for="lastName">Sobrenome</Label>
					<Input id="lastName" name="lastName" placeholder={data.user?.lastName} />
				</div>
			</div>
			<div class="flex w-full items-center gap-5">
				<div class="flex w-1/2 flex-col gap-2">
					<Label for="cpf">CPF</Label>
					<Input
						id="cpf"
						name="cpf"
						placeholder={data.user?.cpf}
						bind:value={cpfValue}
						on:input={digitandoCpf}
						minlength={14}
						maxlength={14}
					/>
				</div>
				<div class="flex w-1/2 flex-col gap-2">
					<Label for="promoCode">Codigo promocional</Label>
					<Input
						id="promoCode"
						name="promoCode"
						placeholder={data.user?.promoCode || 'Não informado'}
						value={data.user?.promoCode}
					/>
				</div>
			</div>
		</Card.Content>
		<Card.Footer class="flex items-center justify-end ">
			<Button class="h-7" type="submit" formaction="?/editarDadosPessoais">Salvar</Button>
		</Card.Footer>
	</Card.Root>
</form>

{#await data.dadosPerfilUser}
	<div class="flex h-full w-full items-center justify-center">
		<Circle3
			size="70"
			ballBottomLeft="#F97316"
			ballBottomRight="#FAFAFA"
			ballTopLeft="#FAFAFA"
			ballTopRight="#F97316"
		/>
	</div>
{:then userProfile}
	<form action="?/editarLocalizacao" method="post">
		<Card.Root class="w-full ">
			<Card.Header>
				<Card.Title>Localizaçao</Card.Title>
				<Card.Description>Aqui vai suas informações de localizaçao.</Card.Description>
			</Card.Header>
			<Card.Content class="flex w-full flex-col">
				<div class="flex w-full gap-5">
					<div class="flex w-1/3 flex-col gap-2">
						<Label for="cep">CEP</Label>
						<Input
							id="cep"
							name="cep"
							placeholder={userProfile?.cep || 'Não informado'}
							minlength={8}
							maxlength={8}
						/>
					</div>
					<div class="flex w-1/3 flex-col gap-2">
						<Label for="rua">Rua</Label>
						<Input id="rua" name="rua" placeholder={userProfile?.rua || 'Não informado'} />
					</div>
					<div class="flex w-1/12 flex-col gap-2">
						<Label for="numeroCasa">Numero</Label>
						<Input
							id="numeroCasa"
							name="numeroCasa"
							placeholder={userProfile?.numeroCasa?.toString() || 'ex: 123'}
						/>
					</div>
					<div class="flex w-1/5 flex-col gap-2">
						<Label for="complemento">Complemento</Label>
						<Input
							id="complemento"
							name="complemento"
							placeholder={userProfile?.complemento || 'ex: Apt 313'}
						/>
					</div>
				</div>
				<div class="mt-5 flex w-full gap-5">
					<div class="flex w-1/2 flex-col gap-2">
						<Label for="bairro">Bairro</Label>
						<Input id="bairro" name="bairro" placeholder={userProfile?.bairro || 'Não informado'} />
					</div>
					<div class="flex w-1/2 flex-col gap-2">
						<Label for="cidade">Cidade</Label>
						<Input id="cidade" name="cidade" placeholder={userProfile?.cidade || 'Não informado'} />
					</div>
					<div class="flex w-1/12 flex-col gap-2">
						<Label for="estado">Estado</Label>
						<Input
							id="estado"
							name="estado"
							placeholder={userProfile?.estado || 'ex: RS'}
							minlength={2}
							maxlength={2}
						/>
					</div>
				</div>
			</Card.Content>
			<Card.Footer class="flex items-center justify-end">
				<Button class="h-7" type="submit" formaction="?/editarLocalizacao">Salvar</Button>
			</Card.Footer>
		</Card.Root>
	</form>
{/await}
