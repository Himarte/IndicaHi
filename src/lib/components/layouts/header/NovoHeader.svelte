<script lang="ts">
	import { PanelLeft } from '@lucide/svelte';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import LogoHimarte from '$lib/img/logos/logo-nome.webp';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as Popover from '$lib/components/ui/popover';
	import type { User } from '$lib/server/auth';
	import AvatarOpcoes from './AvatarOpcoes.svelte';
	import { page } from '$app/stores';
	import { ROUTES } from '$lib/uteis/routes';

	export let userData: User;
	export let isLoggedIn: boolean;

	$: isVendedorExterno = userData?.job === 'Vendedor Externo';
	$: showHeader = isLoggedIn && isVendedorExterno;
</script>

{#if showHeader}
	<header
		class="border-secondary static top-0 z-2 flex h-14 w-full items-center justify-between gap-4 border-b px-3 md:pr-10 md:pl-24"
	>
		<!-- Menu Mobile -->
		<Sheet.Root>
			<Sheet.Trigger>
				{#snippet child({ props })}
					<Button {...props} size="icon" variant="outline" class="sm:hidden">
						<PanelLeft class="h-5 w-5" />
						<span class="sr-only">Toggle Menu</span>
					</Button>
				{/snippet}
			</Sheet.Trigger>

			<Sheet.Content side="left" class="sm:max-w-xs">
				<nav class="flex w-2/3 flex-col items-center gap-5 rounded-xl">
					<a href={ROUTES.HOME}>
						<img src={LogoHimarte} alt="Logo Himarte" class="w-36 py-5 pr-5" />
					</a>
					<Button
						variant="ghost"
						href={ROUTES.HOME}
						class={$page.url.pathname === ROUTES.HOME ? 'bg-secondary text-accent-foreground' : ''}
					>
						Home
					</Button>
					<Button
						variant="ghost"
						href={ROUTES.DASHBOARD}
						class={$page.url.pathname === ROUTES.DASHBOARD
							? 'bg-secondary text-accent-foreground'
							: ''}
					>
						Dashboard
					</Button>
				</nav>
			</Sheet.Content>
		</Sheet.Root>

		<!-- Menu Desktop -->
		<nav class="hidden w-2/3 items-center gap-5 md:flex">
			<Button
				variant="ghost"
				href={ROUTES.HOME}
				class={$page.url.pathname === ROUTES.HOME ? 'bg-secondary text-accent-foreground' : ''}
			>
				Home
			</Button>
			<Button
				variant="ghost"
				href={ROUTES.DASHBOARD}
				class={$page.url.pathname === ROUTES.DASHBOARD ? 'bg-secondary text-accent-foreground' : ''}
			>
				Dashboard
			</Button>
		</nav>

		<!-- Ações do Usuário -->
		<nav class="flex w-1/3 items-center justify-end gap-24">
			<p class="hidden gap-2 text-orange-500 lg:flex">
				Seu Codigo: <span class="text-white">{userData.promoCode}</span>
			</p>
			<Popover.Root>
				<Popover.Trigger>
					<Avatar.Root class="h-10 w-10">
						<Avatar.Image src={userData.avatarUrl} alt="Avatar do Usuario" />
						<Avatar.Fallback>HM</Avatar.Fallback>
					</Avatar.Root>
				</Popover.Trigger>
				<Popover.Content class="mt-3 flex flex-col">
					<AvatarOpcoes />
				</Popover.Content>
			</Popover.Root>
		</nav>
	</header>
{/if}
