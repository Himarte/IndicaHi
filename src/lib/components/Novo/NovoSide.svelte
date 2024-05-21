<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Home, LineChart, Package, ShoppingCart, UsersRound } from 'lucide-svelte';
	import Settings from 'lucide-svelte/icons/settings';
	import IconeHimarte from '$lib/img/logos/icon.webp';
	import { page } from '$app/stores';

	interface NavItem {
		href: string;
		icon: typeof Home; // Tipo do Icone
		label: string;
	}

	const navItems: NavItem[] = [
		{ href: '/dashboard', icon: Home, label: 'Dashboard' },
		{ href: '/dashboard/atividades', icon: LineChart, label: 'Atividades' }
	];
</script>

<aside
	class="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r border-secondary bg-background sm:flex"
>
	<nav class="flex flex-col items-center gap-4 px-2 py-4">
		<a href="/" class=" flex h-8 w-8">
			<img src={IconeHimarte} alt="Himarte" class="transition-all group-hover:scale-110" />
		</a>

		{#each navItems as { href, icon: Icon, label }, i}
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
		{/each}
	</nav>
	<nav class="mt-auto flex flex-col items-center gap-4 px-2 py-4">
		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<a
					href="##"
					class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
					use:builder.action
					{...builder}
				>
					<Settings class="h-5 w-5" />
					<span class="sr-only">Settings</span>
				</a>
			</Tooltip.Trigger>
			<Tooltip.Content side="right">Settings</Tooltip.Content>
		</Tooltip.Root>
	</nav>
</aside>
