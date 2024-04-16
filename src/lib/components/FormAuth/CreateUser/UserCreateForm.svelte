<script lang="ts">
	import Reload from 'svelte-radix/Reload.svelte';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import { Input } from '$lib/components/ui/input';
	import { cn } from '$lib/utils';
	import { toast } from 'svelte-sonner';
	import {
		focarConfirmPasswordErrada,
		validationCelular,
		validationCpf
	} from '../CreateUser/validation/functionsUteis';
	import { Separator } from '$lib/components/ui/separator';

	let className: string | undefined | null = undefined;
	export { className as class };

	let isLoading = false;
	async function carregando() {
		isLoading = true;

		setTimeout(() => {
			isLoading = false;
		}, 2000);
	}
	//  Mascara e Validacao de CPF
	let cpfValue: string = '';

	validationCpf(cpfValue);

	function digitandoCpf(event: InputEvent) {
		const target = event.target as HTMLInputElement;
		cpfValue = validationCpf(target.value);
	}

	//  Mascara e Validacao do celular
	let celularValue: string = '';

	validationCelular(celularValue);

	function digitandoCelular(event: InputEvent) {
		const target = event.target as HTMLInputElement;
		celularValue = validationCelular(target.value);
	}
</script>

<div class={cn('flex flex-col gap-5 md:px-32', className)} {...$$restProps}>
	<form
		method="post"
		action="?/registrar"
		class="flex flex-col items-center"
		use:enhance={({ formData, cancel, submitter, action, formElement }) => {
			if (formData.get('password') !== formData.get('confirmPassword')) {
				toast.warning('As senhas não coincidem', {
					duration: 3500
				});
				// focar no input de senha
				focarConfirmPasswordErrada();
				cancel();
			}

			return async ({ result, update }) => {
				// result e o resultado do envio do formulario
				// update() e uma funcao que atualiza o formulario
				await carregando();
				update();
			};
		}}
	>
		<div class="flex w-full flex-col gap-5">
			<Input
				required
				id="email"
				class="z-[4] bg-background"
				placeholder="exemplo@gmail.com"
				type="email"
				autocapitalize="none"
				autocomplete="email"
				autocorrect="off"
				disabled={isLoading}
				name="email"
			/>
			<div class="flex gap-3">
				<Input
					required
					type="password"
					id="password"
					name="password"
					class="z-[4] bg-background"
					placeholder="Senha"
					disabled={isLoading}
				/>
				<Input
					required
					type="password"
					id="confirmPassword"
					name="confirmPassword"
					class="z-[4] bg-background"
					placeholder="Confirmar senha"
					disabled={isLoading}
				/>
			</div>
			<Separator class="w-full" />
			<Input
				required
				id="name"
				class="z-[4] bg-background"
				placeholder="Nome"
				type="text"
				autocapitalize="words"
				autocorrect="off"
				disabled={isLoading}
				name="name"
			/>
			<Input
				required
				id="lastName"
				class="z-[4] bg-background"
				placeholder="Sobrenome"
				type="text"
				autocapitalize="sentences"
				autocorrect="off"
				disabled={isLoading}
				name="lastName"
			/>
			<div class="flex gap-3">
				<Input
					required
					id="cpf"
					class="z-[4] bg-background"
					placeholder="CPF"
					type="text"
					autocapitalize="off"
					autocorrect="off"
					disabled={isLoading}
					name="cpf"
					minlength={14}
					maxlength={14}
					bind:value={cpfValue}
					on:input={digitandoCpf}
				/>
				<Input
					required
					id="telefone"
					class="z-[4] bg-background"
					placeholder="Telefone"
					type="tel"
					autocapitalize="none"
					autocomplete="tel"
					autocorrect="off"
					disabled={isLoading}
					name="telefone"
					bind:value={celularValue}
					on:input={digitandoCelular}
					maxlength={15}
					minlength={15}
				/>
			</div>
		</div>
		<div class="mt-5 flex w-full items-center justify-center gap-5">
			<Button href="/login">Voltar</Button>
			<Button disabled={isLoading} type="submit">
				{#if isLoading}
					<Reload class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Cadastrar-se
			</Button>
		</div>
	</form>
</div>
