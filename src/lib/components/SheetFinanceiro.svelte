<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import type { LeadsSchema } from '$lib/server/database/schema';
	import StatusDropdown from '$lib/components/StatusDropdown/Dropdown-dashboard.svelte';
	export let lead: LeadsSchema;
	export let cargo: string;
</script>

<Sheet.Root>
	<Sheet.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline">Alterar informações</Button>
	</Sheet.Trigger>
	<Sheet.Content side="right">
		<Sheet.Header>
			<Sheet.Title>Alterar informações</Sheet.Title>
		</Sheet.Header>
		<div class="grid gap-4 py-4">
			<div class="flex flex-col items-start gap-4">
				<Label for="name" class="text-right">Nome</Label>
				<Input id="name" value={lead.fullName} class="col-span-3" />
			</div>
			<div class="flex flex-col items-start gap-4">
				<Label for="username" class="text-right">Data de criação</Label>
				<Input id="username" value={lead.criadoEm} class="col-span-3" />
			</div>
			<div class="flex flex-col items-start gap-4">
				<Label for="username" class="text-right">Telefone</Label>
				<Input id="username" value={lead.telefone} class="col-span-3" />
			</div>
			<div class="flex flex-col items-start gap-4">
				<Label for="username" class="text-right">CPF</Label>
				<Input id="username" value={lead.cpf} class="col-span-3" />
			</div>
			<div class="flex flex-col items-start gap-4">
				<Label for="username" class="text-right">Alterar status</Label>
				<StatusDropdown {lead} {cargo} />
			</div>
			<div class="flex flex-col items-start gap-4">
				<Label for="username" class="text-right">Anexar comprovante</Label>
				<input
					type="file"
					name="arquivo"
					class="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 placeholder-gray-400/70 file:rounded-full file:border-none file:bg-gray-200 file:px-4 file:py-1 file:text-sm file:text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:placeholder-gray-500 dark:file:bg-gray-800 dark:file:text-gray-200 dark:focus:border-blue-300"
					accept=".jpg,.jpeg,.png,.pdf,.webp"
				/>
			</div>
		</div>
		<Sheet.Footer>
			<Sheet.Close asChild let:builder>
				<Button builders={[builder]} type="submit">Salvar</Button>
			</Sheet.Close>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
