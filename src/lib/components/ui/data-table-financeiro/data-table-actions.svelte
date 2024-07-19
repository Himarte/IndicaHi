<script lang="ts">
	import MoreHorizontal from 'lucide-svelte/icons/ellipsis';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import EditarDados from './editar-dados.svelte';
	import VerDados from './ver-dados copy.svelte';
	import { formatarData } from '$lib/uteis/masks';

	export let id: string;
	export let fullName: string;
	export let email: string;
	export let telefone: string;
	export let cpfCnpj: string;
	export let pixKey: string;
	export let pixType: string;
	export let dataAtendido: string;
	export let dataCriado: string;

	// Formatar as datas antes de passá-las para os componentes
	$: formatadoDataAtendido = formatarData(dataAtendido);
	$: formatadoDataCriado = formatarData(dataCriado);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
			<span class="sr-only">Abre o Menu</span>
			<MoreHorizontal class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="border-secondary">
		<DropdownMenu.Group>
			<DropdownMenu.Label>Opções do Menu</DropdownMenu.Label>
			<DropdownMenu.Separator />

			<VerDados
				{fullName}
				{email}
				{telefone}
				{cpfCnpj}
				{pixKey}
				dataAtendido={formatadoDataAtendido}
				dataCriado={formatadoDataCriado}
			/>
			<EditarDados
				{id}
				{fullName}
				{email}
				{telefone}
				{cpfCnpj}
				{pixKey}
				{pixType}
				dataAtendido={formatadoDataAtendido}
				dataCriado={formatadoDataCriado}
			/>
			<!-- <DropdownMenu.Item on:click={() => navigator.clipboard.writeText(id)}>
				Copy payment ID
			</DropdownMenu.Item> -->
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>Deletar</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
