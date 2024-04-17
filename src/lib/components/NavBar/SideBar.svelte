<script lang="ts">
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';

	import HandCoins from 'lucide-svelte/icons/hand-coins';
	import CircleDollarSign from 'lucide-svelte/icons/circle-dollar-sign';

	import * as Tabs from '$lib/components/ui/tabs';
	import { Separator } from '$lib/components/ui/separator';

	export let userRole: string | undefined;

	console.log('Dentro do componente', userRole);

	// Deriva o caminho atual da URL
	const currentPath = derived(page, ($page) => $page.url.pathname);

	// Objeto para organizar os links
	const indicacoesLinks = [
		{ nome: 'Pendentes', href: '/dashboard/indicacoes/pendentes' },
		{ nome: 'Finalizadas', href: '/dashboard/indicacoes/finalizadas' },
		{ nome: 'Canceladas', href: '/dashboard/indicacoes/canceladas' }
	];

	const lucrosLinks = [
		{ nome: 'Pagos', href: '/dashboard/lucros/pagos' },
		{ nome: 'Pendentes', href: '/dashboard/lucros/pendentes' }
	];

	const lucrosLinks2 = [
		{ nome: 'Pagos', href: '/dashboard/lucros/pagos' },
		{ nome: 'Pendentes', href: '/dashboard/lucros/pendentes' }
	];
</script>

<Tabs.Root value="indicacoes" class="sticky top-[5rem] flex h-full w-96">
	<Tabs.List class="flex h-36 w-[100px] flex-col  justify-start gap-2 rounded-r-none">
		<Tabs.Trigger value="indicacoes" class="flex w-full flex-col gap-1 rounded-xl py-4">
			<HandCoins size={30} /></Tabs.Trigger
		>
		<Tabs.Trigger value="lucros" class="flex w-full flex-col gap-1 rounded-xl py-4">
			<CircleDollarSign size={30} />
		</Tabs.Trigger>
		{#if userRole === 'Financeiro'}
			<Tabs.Trigger value="lucros2" class="flex w-full flex-col gap-1 rounded-xl py-4">
				<CircleDollarSign size={30} />
			</Tabs.Trigger>
		{/if}
	</Tabs.List>
	<Tabs.Content
		value="indicacoes"
		class="!mt-0 h-40 rounded-r-2xl rounded-bl-2xl border-secondary bg-secondary"
	>
		<div class="h-full w-48 rounded-2xl border-4 border-secondary bg-background p-4">
			<h4 class="mb-4 text-lg font-bold leading-none">Indicações</h4>
			<Separator class="my-2" />
			<nav class="flex flex-col gap-2">
				{#each indicacoesLinks as { nome, href }}
					<a {href} class="text-sm" class:linkAtivo={$currentPath === href}>{nome}</a>
				{/each}
			</nav>
		</div>
	</Tabs.Content>
	<Tabs.Content value="lucros" class="!mt-0 h-36 rounded-r-2xl border-secondary bg-secondary ">
		<div class="h-full w-48 rounded-2xl border-4 border-secondary bg-background p-4">
			<h4 class="mb-4 text-lg font-bold leading-none">Lucros</h4>
			<Separator class="my-2" />
			<nav class="flex flex-col gap-2">
				{#each lucrosLinks as { nome, href }}
					<a {href} class="text-sm" class:linkAtivo={$currentPath === href}>{nome}</a>
				{/each}
			</nav>
		</div>
	</Tabs.Content>
	<Tabs.Content value="lucros2" class="!mt-0 h-36 rounded-r-2xl border-secondary bg-secondary ">
		<div class="h-full w-48 rounded-2xl border-4 border-secondary bg-background p-4">
			<h4 class="mb-4 text-lg font-bold leading-none">Lucros</h4>
			<Separator class="my-2" />
			<nav class="flex flex-col gap-2">
				{#each lucrosLinks2 as { nome, href }}
					<a {href} class="text-sm" class:linkAtivo={$currentPath === href}>{nome}</a>
				{/each}
			</nav>
		</div>
	</Tabs.Content>
</Tabs.Root>

<style>
	.linkAtivo {
		color: #f97316;
	}
</style>
