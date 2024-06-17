<script lang="ts">
	import type { userDataFromCookies } from '$lib/server/lucia.server';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '../ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { onMount } from 'svelte';

	export let userData: userDataFromCookies;

	const fruits = [
		{ value: 'cpf', label: 'CPF' },
		{ value: 'cnpj', label: 'CNPJ' },
		{ value: 'email', label: 'E-mail' },
		{ value: 'Celular', label: 'Celular' }
	];

	let promoCode = '';
	let promoCodeMessage = '';
	let promoCodeValid = false;

	const checkPromoCode = async () => {
		const formData = new FormData();
		formData.append('promoCode', promoCode);

		try {
			const response = await fetch('/api/perfil/checarPromoCode', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				const result = await response.json();
				promoCodeMessage = result.message;
				promoCodeValid = true;
			} else {
				const result = await response.json();
				promoCodeMessage = result.message;
				promoCodeValid = false;
			}
		} catch (error) {
			console.error('Error:', error);
			promoCodeMessage = 'Erro ao verificar o código promocional';
			promoCodeValid = false;
		}
	};

	const handleSubmit = async (event: Event) => {
		event.preventDefault();
		await checkPromoCode();
	};
</script>

<div class="absolute z-20 flex h-full w-full items-center justify-center bg-primary-foreground/90">
	<Card.Root class="flex h-[60%] w-1/3 flex-col">
		<Card.Header class="text-center">
			<Card.Title class="text-2xl">Bem vindo!</Card.Title>
			<Card.Description class="text-md">
				Prencha algumas informacoes para podermos continuar
			</Card.Description>
		</Card.Header>
		<Card.Content class="flex h-full w-full flex-col gap-5 ">
			<div class="flex w-full flex-col gap-2">
				<div class="flex items-center justify-between">
					<Separator class="flex w-1/3" />
					<p>Dados pessoais</p>
					<Separator class="flex w-1/3" />
				</div>
				<div class="flex w-full gap-5">
					<div class="flex w-full flex-col gap-1.5">
						<Input type="text" id="cpf" placeholder="CPF" />
						<p class="text-sm text-muted-foreground">Ex. 123.456.789-10</p>
					</div>
					<div class="flex w-full flex-col gap-1.5">
						<Input type="text" id="celular" placeholder="Celular" />
						<p class="text-sm text-muted-foreground">Ex. (DD) 99999-9999</p>
					</div>
				</div>
			</div>
			<div class="flex w-full flex-col gap-2">
				<div class="flex items-center justify-between">
					<Separator class="flex w-1/3" />
					<p>Dados de Pagamento</p>
					<Separator class="flex w-1/3" />
				</div>
				<div class="flex w-full gap-5">
					<div class="flex w-full flex-col gap-1.5">
						<Select.Root portal={null}>
							<Select.Trigger class="w-full">
								<Select.Value placeholder="Tipo de chave" />
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									{#each fruits as pixType}
										<Select.Item value={pixType.value} label={pixType.label}>
											{pixType.label}
										</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
							<Select.Input name="pixType" />
						</Select.Root>
						<p class="text-sm text-muted-foreground">Ex. CPF</p>
					</div>
					<div class="flex w-full flex-col gap-1.5">
						<Input type="text" id="pix-key" placeholder="Chave PIX" />
						<p class="text-sm text-muted-foreground">Ex. 123.456.789-10</p>
					</div>
				</div>
			</div>
			<div class="items mt-10 flex w-full items-center justify-between">
				<Separator class="flex w-1/3" />
				<p>Codigo Promocional</p>
				<Separator class="flex w-1/3" />
			</div>
			<form on:submit={handleSubmit} class="flex h-full w-full flex-col gap-5">
				<p class="text-sm text-gray-400">
					Cadastre aqui seu codigo promossional e comece a lucrar com as suas indicaçoes!
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
							placeholder="Seu Codigo Promocional"
						/>
						<Button variant="secondary" type="submit">Verificar</Button>
					</div>
					{#if promoCodeMessage}
						<p
							class="text-sm"
							class:text-green-500={promoCodeValid}
							class:text-destructive={!promoCodeValid}
						>
							{promoCodeMessage}
						</p>
					{:else}
						<p class="text-sm text-gray-400"></p>
					{/if}
				</div>
			</form>
		</Card.Content>
		<Card.Footer class="flex   w-full justify-end">
			<Button variant="secondary">Continuar</Button>
		</Card.Footer>
	</Card.Root>
</div>
