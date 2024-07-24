<script lang="ts">
	import MoreHorizontal from 'lucide-svelte/icons/ellipsis';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import EditarDados from './editar-dados.svelte';
	import VerDados from './ver-dados.svelte';
	import { formatarData } from '$lib/uteis/masks';
	import UserMinus from 'lucide-svelte/icons/user-round-x';

	export let id: string;
	export let fullName: string;
	export let email: string;
	export let telefone: string;
	export let cpfCnpj: string;
	export let dataCriado: string;

	// Formatar as datas antes de passá-las para os componentes
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

			<VerDados {id} {fullName} {email} {telefone} {cpfCnpj} dataCriado={formatadoDataCriado} />
			<EditarDados {id} {fullName} {email} {telefone} {cpfCnpj} dataCriado={formatadoDataCriado} />
			<!-- <DropdownMenu.Item on:click={() => navigator.clipboard.writeText(id)}>
				Copy payment ID
			</DropdownMenu.Item> -->
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item class="flex w-full justify-start gap-2 hover:font-semibold"
			><UserMinus size={18} />Deletar</DropdownMenu.Item
		>
	</DropdownMenu.Content>
</DropdownMenu.Root>
