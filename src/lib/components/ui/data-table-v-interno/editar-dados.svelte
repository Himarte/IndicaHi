<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import UserRoundPen from 'lucide-svelte/icons/pencil-line';
	import Select from './select-editar.svelte';
	export let id: string;
	export let fullName: string;
	export let telefone: string;
	export let cpf: string;
	export let cnpj: string;
	export let dataCriado: string;
	export let status: string;
	console.log(dataCriado);
</script>

<Sheet.Root>
	<Sheet.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			class="flex w-full justify-start gap-2 hover:font-semibold"
			variant="ghost"
		>
			<UserRoundPen size={18} />
			Editar</Button
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
				<p class="font-bold text-orange-600">Cliente:</p>
				<p>{fullName}</p>
			</div>
			{#if cpf.length === 0}
				<div class="rounded-xl border border-secondary p-2">
					<p class="font-bold text-orange-600">CNPJ:</p>
					<p>{cnpj}</p>
				</div>
			{:else}
				<div class="rounded-xl border border-secondary p-2">
					<p class="font-bold text-orange-600">CPF:</p>
					<p>{cpf}</p>
				</div>
			{/if}
			<div class="rounded-xl border border-secondary p-2">
				<p class="font-bold text-orange-600">Telefone:</p>
				<p>{telefone}</p>
			</div>

			<div class="flex flex-col rounded-xl border border-secondary p-2">
				<p class="font-bold text-orange-600">Lead Status:</p>
				<Select {status} />
			</div>
		</div>
		<Sheet.Footer>
			<Sheet.Close asChild let:builder>
				<Button builders={[builder]} type="submit">Save changes</Button>
			</Sheet.Close>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
