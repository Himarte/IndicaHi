<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import UserSearch from 'lucide-svelte/icons/user-round-search';

	export let id: string;
	export let fullName: string;
	export let telefone: string;
	export let cpf: string;
	export let cnpj: string;
	export let dataCriado: string;

	const separarDataHora = (dataHora: string) => {
		const [data, hora] = dataHora.split(' - ');
		return { data, hora };
	};

	const { data, hora } = separarDataHora(dataCriado);

</script>

<Sheet.Root>
	<Sheet.Trigger asChild let:builder>
		<Button builders={[builder]} class="flex w-full justify-start gap-2" variant="ghost"
			><UserSearch size={18} /> Ver dados</Button
		>
	</Sheet.Trigger>
	<Sheet.Content side="right" class="flex h-full flex-col justify-between border-secondary">
		<Sheet.Header>
			<Sheet.Title class="text-orange-600">Dados do Lead</Sheet.Title>
			<Sheet.Description>Aqui você pode visualizar e editar alguns dados do Lead.</Sheet.Description
			>
		</Sheet.Header>
		<div class="flex h-full flex-col gap-2">
			<div class="rounded-xl border border-secondary p-2 px-2">
				<p class="font-bold text-orange-600">Cliente:</p>
				<p>{fullName}</p>
			</div>
			<div class="rounded-xl border border-secondary p-2 px-2">
				<p class="font-bold text-orange-600">CPF:</p>
				<p>{cpf}</p>
			</div>
			<div class="rounded-xl border border-secondary p-2 px-2">
				<p class="font-bold text-orange-600">Telefone:</p>
				<p>{telefone}</p>
			</div>
			<div class="rounded-xl border border-secondary p-2 px-2">
				<p class="font-bold text-orange-600">CPF:</p>
				<p>{cnpj}</p>
			</div>

			<div class="flex flex-col rounded-xl border border-secondary p-2 px-2">
				<p class="font-bold text-orange-600">Atendido</p>
				<div>
					<p>Dia: {data}</p>
					<p>Hora: {hora}</p>
				</div>
			</div>
		</div>
		<Sheet.Footer>
			<Sheet.Close asChild let:builder>
				<Button builders={[builder]}>Voltar</Button>
			</Sheet.Close>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
