<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Label } from '$lib/components/ui/label/index.js';
	import type { ActionData, PageData } from './$types';
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';
	import type { userDataFromCookies } from '$lib/server/lucia.server';
	import { applyMask } from '$lib/uteis/masks';

	export let data: PageData;
	const userProfile: userDataFromCookies | null = data.user;

	let selectedPixType = userProfile?.pixType || '';
	let pixCode = userProfile?.pixCode || '';

	const pixTypes = [
		{ value: 'cpf', label: 'CPF' },
		{ value: 'cnpj', label: 'CNPJ' }
	];

	export let form: ActionData;

	// Aplica máscara quando o tipo de PIX ou o código mudar
	$: if (pixCode && selectedPixType) {
		pixCode = applyMask(pixCode, selectedPixType);
	}

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
	method="post"
	action="?/editarDadosPix"
	use:enhance={({ formData }) => {
		// Garantir que o pixType seja enviado corretamente
		formData.set('pixType', selectedPixType);
		console.log('Dados do form:', Object.fromEntries(formData));
		return async ({ update }) => {
			update();
		};
	}}
>
	<Card.Root class="w-full">
		<Card.Header>
			<Card.Title>Dados para pagamentos via Pix</Card.Title>
			<Card.Description>Aqui vai suas informações de pagamento.</Card.Description>
		</Card.Header>
		<Card.Content class="flex w-full items-center gap-5">
			<div class="flex w-1/6 flex-col gap-2">
				<Label>Tipo de Chave</Label>
				<RadioGroup.Root bind:value={selectedPixType}>
					{#each pixTypes as type}
						<div class="flex items-center space-x-2">
							<RadioGroup.Item value={type.value} id={type.value} />
							<input type="hidden" name="pixType" value={selectedPixType} />
							<Label for={type.value}>{type.label}</Label>
						</div>
					{/each}
				</RadioGroup.Root>
			</div>
			<div class="flex w-1/2 flex-col gap-2">
				<Label for="pixCode">Chave Pix</Label>
				<Input
					id="pixCode"
					name="pixCode"
					bind:value={pixCode}
					placeholder={selectedPixType === 'cpf'
						? applyMask(pixCode, 'cpf')
						: selectedPixType === 'cnpj'
							? applyMask(pixCode, 'cnpj')
							: 'Selecione um tipo de chave PIX'}
					disabled={!selectedPixType}
				/>
			</div>
		</Card.Content>

		<Card.Footer class="flex items-center justify-end">
			<Button class="h-7" type="submit">Salvar</Button>
		</Card.Footer>
	</Card.Root>
</form>
