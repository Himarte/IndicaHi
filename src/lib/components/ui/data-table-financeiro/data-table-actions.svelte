<script lang="ts">
	import MoreHorizontal from 'lucide-svelte/icons/ellipsis';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import SheetEditar from './sheet-financeiro.svelte';
	export let id: string;
	export let fullName: string;
	export let email: string;
	export let telefone: string;
	export let cpfCnpj: string;
	export let pixKey: string;
	export let pixType: string;
	export let dataAtendido: string;

	console.log(dataAtendido);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
			<span class="sr-only">Open menu</span>
			<MoreHorizontal class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>Opçoes do Menu</DropdownMenu.Label>
			<SheetEditar />
			<DropdownMenu.Item on:click={() => navigator.clipboard.writeText(id)}>
				Copy payment ID
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>View customer</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
