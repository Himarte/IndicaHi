<script lang="ts">
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';

	import HandCoins from 'lucide-svelte/icons/hand-coins';
	import CircleDollarSign from 'lucide-svelte/icons/circle-dollar-sign';

	import * as Tabs from '$lib/components/ui/tabs';
	import { Separator } from '$lib/components/ui/separator';
	import Button from '../ui/button/button.svelte';
	export let userRole: string | undefined;

	const currentPath = derived(page, ($page) => $page.url.pathname);

	const tabsLinks = {
		Indicacoes: [
			{ nome: 'Pendentes', href: '/dashboard/indicacoes/pendentes' },
			{ nome: 'Finalizadas', href: '/dashboard/indicacoes/finalizadas' },
			{ nome: 'Canceladas', href: '/dashboard/indicacoes/canceladas' }
		],
		Lucros: [
			{ nome: 'Pagos', href: '/dashboard/lucros/pagos' },
			{ nome: 'Pendentes', href: '/dashboard/lucros/pendentes' }
		],
		Financeiro: [
			{ nome: 'Pendentes', href: '/dashboard/financeiro/pendentes' },
			{ nome: 'Pagos', href: '/dashboard/financeiro/pagos' }
		]
	};
</script>

<Tabs.Root value="Indicacoes" class="sticky top-[5rem] flex h-full w-96 bg-background">
	<Tabs.List
		class="flex h-max w-[100px] flex-col justify-start gap-1 rounded-l-md rounded-r-none border border-secondary py-0 pl-0 pr-[0.05rem]"
	>
		<Tabs.Trigger value="Indicacoes" class="flex w-full flex-col gap-1 rounded-md py-4">
			<HandCoins size={30} />
		</Tabs.Trigger>
		<Tabs.Trigger value="Lucros" class="flex w-full flex-col gap-1 rounded-md py-4">
			<CircleDollarSign size={30} />
		</Tabs.Trigger>
		{#if userRole === 'Financeiro'}
			<Tabs.Trigger value="Financeiro" class="flex w-full flex-col gap-1 rounded-md py-4">
				<CircleDollarSign size={30} />
			</Tabs.Trigger>
		{/if}
	</Tabs.List>
	{#each Object.entries(tabsLinks) as [tabValue, links]}
		<Tabs.Content
			value={tabValue}
			class="!mt-0 h-max rounded-r-md rounded-bl-md border-secondary bg-secondary"
		>
			<div class="h-full w-48 rounded-md border border-secondary bg-background p-4">
				<h4 class="mb-4 text-lg font-bold leading-none">{tabValue}</h4>
				<Separator class="my-2" />
				<nav class="flex flex-col gap-2">
					{#each links as { nome, href }}
						<Button
							variant="ghost"
							{href}
							class="text-sm {$currentPath === href ? 'bg-accent text-accent-foreground' : ''}"
							>{nome}</Button
						>
					{/each}
				</nav>
			</div>
		</Tabs.Content>
	{/each}
</Tabs.Root>
