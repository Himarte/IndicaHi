<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	export let fullName: string;
	export let email: string;
	export let telefone: string;
	export let cpfCnpj: string;
	export let pixKey: string;
	export let dataAtendido: string;
	export let dataCriado: string;
</script>

<Sheet.Root>
	<Sheet.Trigger asChild let:builder>
		<Button builders={[builder]} class="flex w-full justify-start" variant="ghost">Ver dados</Button
		>
	</Sheet.Trigger>
	<Sheet.Content side="right" class="flex h-full flex-col justify-between border-secondary">
		<Sheet.Header>
			<Sheet.Title>Dados do Lead</Sheet.Title>
			<Sheet.Description>Aqui você pode visualizar e editar alguns dados do Lead.</Sheet.Description
			>
		</Sheet.Header>
		<div class="flex h-full flex-col gap-2">
			<div class="rounded-xl border border-secondary p-2">
				<p class="font-bold">Cliente:</p>
				<p>{fullName}</p>
			</div>
			<div class="rounded-xl border border-secondary p-2">
				<p class="font-bold">CPF:</p>
				<p>{cpfCnpj}</p>
			</div>
			<div class="rounded-xl border border-secondary p-2">
				<p class="font-bold">Telefone:</p>
				<p>{telefone}</p>
			</div>
			<div class="rounded-xl border border-secondary p-2">
				<p class="font-bold">E-mail:</p>
				<p>{email}</p>
			</div>

			<div class="rounded-xl border border-secondary p-2">
				<p class="font-bold">Chave Pix:</p>
				<p>{pixKey}</p>
			</div>

			<div class="flex gap-2">
				<div class="w-1/2 rounded-xl border border-secondary p-2">
					<p class="font-bold">Atendido:</p>
					<p>{dataAtendido}</p>
				</div>
				<div class="w-1/2 rounded-xl border border-secondary p-2">
					<p class="font-bold">Criado</p>
					<p>{dataCriado}</p>
				</div>
			</div>
		</div>
		<Sheet.Footer>
			<Sheet.Close asChild let:builder>
				<Button builders={[builder]} type="submit">Save changes</Button>
			</Sheet.Close>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
