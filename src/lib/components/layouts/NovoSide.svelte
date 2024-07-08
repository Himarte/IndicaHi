<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Home, LineChart, Package, ShoppingCart, UsersRound } from 'lucide-svelte';
	import Settings from 'lucide-svelte/icons/settings';
	import IconeHimarte from '$lib/img/logos/icon.webp';
	import { page } from '$app/stores';
	import type { userDataFromCookies } from '$lib/server/lucia.server';

	export let userData: userDataFromCookies;
	$: userRole = userData.job;
	// console.log('UserRole', userRole);

	interface NavItem {
		icon: typeof Home; // Tipo do Icone
		label: string;
		href: string;
		role: 'Vendedor Externo' | 'Vendedor Interno' | 'Financeiro' | 'Admin';
	}

	const navItems: NavItem[] = [
		{ href: '/dashboard', icon: Home, label: 'Dashboard', role: 'Vendedor Externo' },
		{
			href: '/dashboard/atividades',
			icon: LineChart,
			label: 'Atividades',
			role: 'Vendedor Externo'
		},
		{ href: '/financeiro', icon: ShoppingCart, label: 'Financeiro', role: 'Financeiro' }
	];
</script>

<aside
	class="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r border-secondary bg-background sm:flex"
>
	<nav class="flex flex-col items-center gap-4 px-2 py-4">
		<a href="/" class=" flex h-8 w-8">
			<img src={IconeHimarte} alt="Himarte" class="transition-all group-hover:scale-110" />
		</a>

		{#each navItems as { href, icon: Icon, label, role }, i}
			{#if userRole === role}
				<Tooltip.Root>
					<Tooltip.Trigger asChild let:builder>
						<a
							{href}
							class="{$page.url.pathname === href
								? 'bg-accent'
								: ''} flex h-9 w-9 items-center justify-center rounded-lg text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
							use:builder.action
							{...builder}
						>
							<Icon class="h-5 w-5" />
							<span class="sr-only">{label}</span>
						</a>
					</Tooltip.Trigger>
					<Tooltip.Content side="right">{label}</Tooltip.Content>
				</Tooltip.Root>
			{/if}
		{/each}
	</nav>
	<nav class="mt-auto flex flex-col items-center gap-4 px-2 py-4">
		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<a
					href="/configuracoes"
					class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 {$page
						.url.pathname === '/configuracoes'
						? 'bg-accent'
						: ''} {$page.url.pathname === '/configuracoes/privacidade' ? 'bg-accent' : ''}"
					use:builder.action
					{...builder}
				>
					<Settings class="h-5 w-5" />
					<span class="sr-only">Configurações</span>
				</a>
			</Tooltip.Trigger>
			<Tooltip.Content side="right">Configurações</Tooltip.Content>
		</Tooltip.Root>
	</nav>
</aside>
