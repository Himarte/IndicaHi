<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	export let id: string;
	export let fullName: string;
	export let email: string;
	export let telefone: string;
	export let cpfCnpj: string;
	export let pixKey: string;
	export let pixType: string;
	export let dataAtendido: string;
	export let dataCriado: string;
</script>

<Sheet.Root>
	<Sheet.Trigger asChild let:builder>
		<Button builders={[builder]} class="flex w-full items-start justify-start" variant="ghost"
			>Editar Lead</Button
		>
	</Sheet.Trigger>
	<Sheet.Content side="right" class="flex h-full flex-col justify-between border-secondary">
		<Sheet.Header>
			<Sheet.Title>Dados do Lead</Sheet.Title>
			<Sheet.Description>Aqui você pode visualizar e editar alguns dados do Lead.</Sheet.Description
			>
		</Sheet.Header>
		<div class="flex h-full flex-col gap-2">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Cliente</Label>
				<Input id="name" bind:value={fullName} class="col-span-3" />
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="email" class="text-right">E-mail</Label>
				<Input id="email" bind:value={email} class="col-span-3" />
			</div>
		</div>
		<Sheet.Footer>
			<Sheet.Close asChild let:builder>
				<Button builders={[builder]} type="submit">Save changes</Button>
			</Sheet.Close>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
