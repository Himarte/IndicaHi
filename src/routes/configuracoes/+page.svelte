<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button';
	import { validationCpf } from '$lib/uteis/authValidationsUteis';
	import type { userDataFromCookies } from '$lib/server/lucia.server';
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';
	import { message } from 'sveltekit-superforms';

	let cpfValue: string = '';
	function digitandoCpf(event: InputEvent) {
		const target = event.target as HTMLInputElement;
		cpfValue = validationCpf(target.value);
	}

	const userProfile: userDataFromCookies | null = data.user;

	// console.log('Resposta do backend', data);
</script>

<form
	method="post"
	class="relative"
	use:enhance={() => {
		return async ({ result, update }) => {
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
	<Card.Root class="h-full w-full">
		<Card.Header>
			<Card.Title>Dados pessoais</Card.Title>
			<Card.Description>Aqui vão suas informações básicas.</Card.Description>
		</Card.Header>
		<Card.Content class="flex w-full flex-col items-center gap-5">
			<div class="flex w-full items-center gap-5">
				<div class="flex w-1/2 flex-col gap-2">
					<Label for="name">Nome</Label>
					<Input id="name" name="name" disabled placeholder={data.user?.name} />
				</div>
				<div class="flex w-1/2 flex-col gap-2">
					<Label for="cpf">CPF</Label>
					<Input
						id="cpf"
						name="cpf"
						placeholder={data.user?.cpf || 'ex: 123.456.789-10'}
						bind:value={cpfValue}
						on:input={digitandoCpf}
						minlength={14}
						maxlength={14}
					/>
				</div>
			</div>
			<div class="flex w-full items-center gap-5">
				<div class="flex w-1/2 flex-col gap-2">
					<Label for="email">Email</Label>
					<Input id="email" name="email" disabled placeholder={data.user?.email} />
				</div>
				<div class="flex w-1/2 flex-col gap-2">
					<Label for="promoCode">Código promocional</Label>
					<Input
						id="promoCode"
						name="promoCode"
						placeholder={data.user?.promoCode || 'Não informado'}
						value={data.user?.promoCode}
					/>
				</div>
			</div>
		</Card.Content>
		<Card.Footer class="flex items-center justify-end">
			<Button class="h-7" type="submit" formaction="?/editarDadosPessoais">Salvar</Button>
		</Card.Footer>
	</Card.Root>
</form>

<form
	method="post"
	use:enhance={() => {
		return async ({ result, update }) => {
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
	<Card.Root class="w-full">
		<Card.Header>
			<Card.Title>Localização</Card.Title>
			<Card.Description>Aqui vão suas informações de localização.</Card.Description>
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
					<Label for="numeroCasa">Número</Label>
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
