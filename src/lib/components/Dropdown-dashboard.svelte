<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { CircleEllipsis } from 'lucide-svelte';
	import { Badge } from './ui/badge';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]}><CircleEllipsis /></Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56 border-[0.02rem] border-border">
		<DropdownMenu.Label>Status</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.RadioGroup>
			<DropdownMenu.RadioItem value="sendoAtendido"
				><Badge class="w-28 bg-blue-400 hover:bg-blue-400">Sendo Atendido</Badge
				></DropdownMenu.RadioItem
			>
			<DropdownMenu.RadioItem value="bottom"
				><Badge class="w-28 bg-green-400 hover:bg-green-400">Finalizado</Badge
				></DropdownMenu.RadioItem
			>
			<DropdownMenu.RadioItem value="right"
				><Badge class="w-28 bg-gray-400 hover:bg-gray-400">Cancelado</Badge></DropdownMenu.RadioItem
			>
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>
