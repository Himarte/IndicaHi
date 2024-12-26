<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import {
		Home,
		LineChart,
		Settings,
		Table2,
		Banknote,
		UserRoundSearch,
		UserPlus
	} from 'lucide-svelte';
	import IconeHimarte from '$lib/img/logos/icon.webp';
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import type { userDataFromCookies } from '$lib/server/lucia.server';

	export let userData: userDataFromCookies;

	interface NavItem {
		icon: typeof Home;
		label: string;
		href: string;
		roles: string[];
		activePatterns: string[];
	}

	const navItems: NavItem[] = [
		{
			href: '/dashboard',
			icon: Home,
			label: 'Dashboard',
			roles: ['Vendedor Externo'],
			activePatterns: ['/dashboard']
		},
		{
			href: '/dashboard/atividades',
			icon: LineChart,
			label: 'Atividades',
			roles: ['Vendedor Externo'],
			activePatterns: ['/dashboard/atividades']
		},
		{
			href: '/financeiro',
			icon: Table2,
			label: 'Financeiro',
			roles: ['Financeiro'],
			activePatterns: ['/financeiro', '/financeiro/pagamentos']
		},
		{
			href: '/financeiro/pagamentos',
			icon: Banknote,
			label: 'Pagamentos',
			roles: ['Financeiro'],
			activePatterns: ['/financeiro/pagamentos']
		},
		{
			href: '/interno',
			icon: Table2,
			label: 'Estoque',
			roles: ['Vendedor Interno'],
			activePatterns: ['/interno']
		},
		{
			href: '/admin/listas/vendedores-internos',
			icon: UserRoundSearch,
			label: 'Listas',
			roles: ['Admin'],
			activePatterns: [
				'/admin/listas',
				'/admin/listas/vendedores-internos',
				'/admin/listas/vendedores-externos',
				'/admin/listas/administradores',
				'/admin/listas/financeiro'
			]
		},
		{
			href: '/admin/criar/vendedores-internos',
			icon: UserPlus,
			label: 'Criar',
			roles: ['Admin'],
			activePatterns: [
				'/admin/criar',
				'/admin/criar/vendedores-internos',
				'/admin/criar/vendedores-externos',
				'/admin/criar/administradores',
				'/admin/criar/financeiro'
			]
		}
	];

	const configItem = {
		href: '/configuracoes',
		icon: Settings,
		label: 'Configurações',
		roles: ['Vendedor Externo', 'Vendedor Interno', 'Financeiro', 'Admin'],
		activePatterns: ['/configuracoes', '/configuracoes/privacidade']
	};

	$: userRole = userData.job;
	$: filteredNavItems = navItems.filter((item) => item.roles.includes(userRole));

	const isActiveRoute = (href: string, activePatterns: string[]) => {
		return activePatterns.some((pattern) => $page.url.pathname.startsWith(pattern));
	};

	// Store derivado para monitorar a rota ativa
	const activeRoute = derived(page, ($page) => $page.url.pathname);
</script>

<aside
	class="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r border-secondary bg-background sm:flex"
>
	<nav class="flex flex-col items-center gap-4 px-2 py-4">
		<a href="/" class="flex h-8 w-8">
			<img src={IconeHimarte} alt="Himarte" class="transition-all group-hover:scale-110" />
		</a>

		{#each filteredNavItems as { href, icon: Icon, label, activePatterns }}
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<a
						{href}
						class="flex h-9 w-9 items-center justify-center rounded-lg text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8 {$activeRoute &&
						isActiveRoute(href, activePatterns)
							? 'bg-accent'
							: ''}"
						use:builder.action
						{...builder}
					>
						<Icon class="h-5 w-5" />
						<span class="sr-only">{label}</span>
					</a>
				</Tooltip.Trigger>
				<Tooltip.Content side="right">{label}</Tooltip.Content>
			</Tooltip.Root>
		{/each}
	</nav>

	<nav class="mt-auto flex flex-col items-center gap-4 px-2 py-4">
		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<a
					href={configItem.href}
					class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 {$activeRoute &&
					isActiveRoute(configItem.href, configItem.activePatterns)
						? 'bg-accent'
						: ''}"
					use:builder.action
					{...builder}
				>
					<Settings class="h-5 w-5" />
					<span class="sr-only">{configItem.label}</span>
				</a>
			</Tooltip.Trigger>
			<Tooltip.Content side="right">{configItem.label}</Tooltip.Content>
		</Tooltip.Root>
	</nav>
</aside>
