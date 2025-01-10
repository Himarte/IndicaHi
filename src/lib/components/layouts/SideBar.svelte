<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import {
		Home,
		LineChart,
		Settings,
		Table2,
		Banknote,
		UserRoundSearch,
		UserPlus,
		LogOut,
		HelpCircle
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
			icon: LineChart,
			label: 'Dashboard',
			roles: ['Vendedor Externo'],
			activePatterns: ['/dashboard']
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
			href: '/admin/listas',
			icon: UserRoundSearch,
			label: 'Listas',
			roles: ['Admin'],
			activePatterns: ['/admin/listas']
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

	const configItem = [
		{
			href: '/configuracoes',
			icon: Settings,
			label: 'Configurações',
			roles: ['Vendedor Externo', 'Vendedor Interno', 'Financeiro', 'Admin'],
			activePatterns: ['/configuracoes', '/configuracoes/privacidade']
		},
		{
			href: '/suporte',
			icon: HelpCircle,
			label: 'Suporte',
			roles: ['Vendedor Externo', 'Vendedor Interno', 'Financeiro', 'Admin'],
			activePatterns: ['/suporte']
		}
	];

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
					href={configItem[0].href}
					class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 {$activeRoute &&
					isActiveRoute(configItem[0].href, configItem[0].activePatterns)
						? 'bg-accent'
						: ''}"
					use:builder.action
					{...builder}
				>
					<Settings class="h-5 w-5" />
					<span class="sr-only">{configItem[0].label}</span>
				</a>
			</Tooltip.Trigger>
			<Tooltip.Content side="right">{configItem[0].label}</Tooltip.Content>
		</Tooltip.Root>

		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<a
					href={configItem[1].href}
					class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 {$activeRoute &&
					isActiveRoute(configItem[1].href, configItem[1].activePatterns)
						? 'bg-accent'
						: ''}"
					use:builder.action
					{...builder}
				>
					<HelpCircle class="h-5 w-5" />
					<span class="sr-only">{configItem[1].label}</span>
				</a>
			</Tooltip.Trigger>
			<Tooltip.Content side="right">{configItem[1].label}</Tooltip.Content>
		</Tooltip.Root>

		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<form action="/logout" method="POST">
					<button
						type="submit"
						class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
						use:builder.action
						{...builder}
					>
						<LogOut class="h-5 w-5" />
						<span class="sr-only">Sair</span>
					</button>
				</form>
			</Tooltip.Trigger>
			<Tooltip.Content side="right">Sair</Tooltip.Content>
		</Tooltip.Root>
	</nav>
</aside>
