<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { Circle3 } from 'svelte-loading-spinners';
	import type { ActionData, PageData } from './$types';
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';
	export let data: PageData;

	const userProfile = data.dadosPerfilUser;

	const pixTypes = [
		{ value: 'CPF', label: 'CPF' },
		{ value: 'CNPJ', label: 'CNPJ' },
		{ value: 'Email', label: 'Email' },
		{ value: 'Celular', label: 'Celular' }
	];
	export let form: ActionData;

	$: if (form?.message) {
		if (form?.status === 400) {
			toast.warning(`${form?.message}`, {
				duration: 3500
			});
		} else if (form?.status === 500) {
			toast.warning(`${form?.message}`, {
				duration: 3500
			});
		} else if (form.status === 200) {
			toast.success(`${form.message}`, {
				duration: 3500
			});
		} else {
			toast.error(`Erro desconhecido, entre em contato com o suporte`, {
				duration: 3500
			});
		}
	}
</script>

<form
	action="?/trocaEmail"
	method="post"
	use:enhance={() => {
		return async ({ update }) => {
			update();
		};
	}}
>
	<Card.Root class="w-full ">
		<Card.Header>
			<Card.Title>Troca de Email</Card.Title>
			<Card.Description>Você pode trocar o seu e-mail</Card.Description>
		</Card.Header>
		<Card.Content class="flex w-full items-center gap-5">
			<div class="flex w-1/2 flex-col gap-2">
				<Label for="oldEmail">Email Atual</Label>
				<Input id="oldEmail" disabled name="oldEmail" type="email" placeholder={data.user?.email} />
			</div>
			<div class="flex w-1/2 flex-col gap-2">
				<Label for="newEmail">Novo e-mail</Label>
				<Input id="newEmail" name="newEmail" type="email" placeholder={'Digite o novo e-mail...'} />
			</div>
		</Card.Content>
		<Card.Footer class="flex items-center justify-end ">
			<Button class="h-7" type="submit" formaction="?/trocaEmail">Salvar</Button>
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
	<form
		method="post"
		action="?/editarDadosPix"
		use:enhance={() => {
			return async ({ update }) => {
				update();
			};
		}}
	>
		<Card.Root class=" w-full  ">
			<Card.Header>
				<Card.Title>Dados para pagamentos via Pix</Card.Title>
				<Card.Description>Aqui vai suas informações de pagamento.</Card.Description>
			</Card.Header>
			<Card.Content class="flex w-full items-center gap-5">
				<div class="flex flex-col gap-2">
					<Label>Tipo de Chave</Label>
					<Select.Root>
						<Select.Trigger class="w-[180px]">
							<Select.Value placeholder={userProfile?.pixType || 'Selecione...'} />
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{#each pixTypes as pixtype}
									<Select.Item value={pixtype.value} label={pixtype.label}
										>{pixtype.label}</Select.Item
									>
								{/each}
							</Select.Group>
						</Select.Content>
						<Select.Input name="pixType" />
					</Select.Root>
				</div>
				<div class="flex w-1/2 flex-col gap-2">
					<Label for="pixCode">Chave Pix</Label>
					<Input
						id="pixCode"
						name="pixCode"
						placeholder={userProfile?.pixCode || 'Não informado'}
						value={userProfile?.pixCode}
					/>
				</div>
			</Card.Content>

			<Card.Footer class="flex items-center justify-end ">
				<Button class="h-7" type="submit" formaction="?/editarDadosPix">Salvar</Button>
			</Card.Footer>
		</Card.Root>
	</form>
{/await}
