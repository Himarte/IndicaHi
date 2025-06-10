<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import {
		Home,
		LineChart,
		Settings,
		Table2,
		Banknote,
		UserRoundSearch,
		FileSearch,
		LogOut,
		HelpCircle,
		TrophyIcon
	} from '@lucide/svelte';
	import IconeHimarte from '$lib/img/logos/icon.webp';
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import type { User } from '$lib/server/auth';
	import { NAV_ITEMS, CONFIG_ITEMS, routeHelpers, ROUTES } from '$lib/uteis/routes';

	export let userData: User;

	// Mapeamento de ícones
	const iconMap: Record<string, any> = {
		'/dashboard': LineChart,
		'/dashboard/recompensa': TrophyIcon,
		'/financeiro': Table2,
		'/financeiro/pagamentos': Banknote,
		'/interno': Table2,
		'/admin/users': UserRoundSearch,
		'/admin/leads': FileSearch,
		'/configuracoes': Settings,
		'/suporte': HelpCircle
	};

	$: userRole = userData.job;
	$: filteredNavItems = routeHelpers.filterNavItemsByRole(NAV_ITEMS, userRole);
	$: filteredConfigItems = routeHelpers.filterNavItemsByRole(CONFIG_ITEMS, userRole);

	// Store derivado para monitorar a rota ativa
	const activeRoute = derived(page, ($page) => $page.url.pathname);
</script>

<aside
	class="border-secondary bg-background fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r sm:flex"
>
	<nav class="flex flex-col items-center gap-4 px-2 py-4">
		<a href={ROUTES.HOME} class="flex h-8 w-8">
			<img src={IconeHimarte} alt="Himarte" class="transition-all group-hover:scale-110" />
		</a>

		{#each filteredNavItems as { href, label, activePatterns }}
			{@const Icon = iconMap[href] || Home}
			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger>
						{#snippet child({ props })}
							<a
								{href}
								class="text-accent-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 {routeHelpers.isActiveRoute(
									$activeRoute,
									href,
									activePatterns
								)
									? 'bg-accent'
									: ''}"
								{...props}
							>
								<Icon class="h-5 w-5" />
								<span class="sr-only">{label}</span>
							</a>
						{/snippet}
					</Tooltip.Trigger>
					<Tooltip.Content side="right">{label}</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>
		{/each}
	</nav>

	<nav class="mt-auto flex flex-col items-center gap-4 px-2 py-4">
		{#each filteredConfigItems as { href, label, activePatterns }}
			{@const Icon = iconMap[href] || Settings}
			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger>
						{#snippet child({ props })}
							<a
								{href}
								class="text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 {routeHelpers.isActiveRoute(
									$activeRoute,
									href,
									activePatterns
								)
									? 'bg-accent'
									: ''}"
								{...props}
							>
								<Icon class="h-5 w-5" />
								<span class="sr-only">{label}</span>
							</a>
						{/snippet}
					</Tooltip.Trigger>
					<Tooltip.Content side="right">{label}</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>
		{/each}

		<form action="/logout" method="POST">
			<button
				type="submit"
				class="text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8"
			>
				<LogOut class="h-5 w-5" />
				<span class="sr-only">Sair</span>
			</button>
		</form>
	</nav>
</aside>
