<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import UserSearch from 'lucide-svelte/icons/user-round-search';

	export let id: string;
	export let fullName: string;
	export let email: string;
	export let telefone: string;
	export let cpfCnpj: string;
	export let dataCriado: string;

	console.log(id);
</script>

<Sheet.Root>
	<Sheet.Trigger asChild let:builder>
		<Button builders={[builder]} class="flex w-full justify-start gap-2" variant="ghost"
			><UserSearch size={18} /> Ver dados</Button
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
			</div>

			<div class="flex gap-2">
				<div class="w-1/2 rounded-xl border border-secondary p-2">
					<p class="font-bold">Atendido:</p>
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
