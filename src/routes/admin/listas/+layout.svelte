<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { page } from '$app/stores';
</script>

<div class="flex h-full w-full">
	<div class="flex min-w-60 flex-col items-center gap-2 py-2">
		<h1 class="text-2xl font-bold">Listar</h1>
		<h4 class="pb-2 text-sm text-gray-500">Selecione uma lista para visualizar</h4>
		<div class="flex flex-col gap-2">
			<Button
				variant={$page.url.pathname === '/admin/listas/vendedores-internos' ? 'default' : 'outline'}
				href="/admin/listas/vendedores-internos"
				class="w-full"
			>
				Vendedores Internos
			</Button>
			<Button
				variant={$page.url.pathname === '/admin/listas/vendedores-externos' ? 'default' : 'outline'}
				href="/admin/listas/vendedores-externos"
				class="w-full"
			>
				Vendedores Externos
			</Button>
			<Button
				variant={$page.url.pathname === '/admin/listas/financeiro' ? 'default' : 'outline'}
				href="/admin/listas/financeiro"
				class="w-full"
			>
				Financeiro
			</Button>
			<Button
				variant={$page.url.pathname === '/admin/listas/administradores' ? 'default' : 'outline'}
				href="/admin/listas/administradores"
				class="w-full"
			>
				Administradores
			</Button>
		</div>
	</div>
	<Separator orientation="vertical" class="h-full" />
	<div class="w-full flex-1">
		<slot />
	</div>
</div>
