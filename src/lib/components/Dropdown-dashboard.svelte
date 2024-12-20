<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from './ui/badge';
	import type { LeadsSchema } from '$lib/server/database/schema';

	export let lead: LeadsSchema;
	console.log(lead);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button
			variant="outline"
			size="sm"
			class="bg-zinc-900 text-xs hover:bg-zinc-950"
			builders={[builder]}>Mudar Status</Button
		>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-44 border-[0.02rem] border-border">
		<DropdownMenu.Label>Status</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.RadioGroup class="flex w-full flex-col items-start justify-center">
			<DropdownMenu.RadioItem value="sendoAtendido" class="flex w-full items-center  justify-center"
				><Badge class="w-28 bg-blue-400 hover:bg-blue-400">Sendo Atendido</Badge
				></DropdownMenu.RadioItem
			>
			<DropdownMenu.RadioItem value="bottom" class="flex w-full items-center justify-center"
				><Badge class="w-28 bg-green-400 hover:bg-green-400">Finalizado</Badge
				></DropdownMenu.RadioItem
			>
			<DropdownMenu.RadioItem value="right" class="flex w-full items-center justify-center"
				><Badge class="w-28 bg-gray-400 hover:bg-gray-400">Cancelado</Badge></DropdownMenu.RadioItem
			>
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>
