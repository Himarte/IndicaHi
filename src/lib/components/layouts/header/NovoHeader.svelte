<script lang="ts">
	import PanelLeft from 'lucide-svelte/icons/panel-left';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import LogoHimarte from '$lib/img/logos/logo-nome.webp';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as Popover from '$lib/components/ui/popover';
	import type { userDataFromCookies } from '$lib/server/lucia.server';
	import AvatarOpcoes from './AvatarOpcoes.svelte';
	import { page } from '$app/stores';

	export let userData: userDataFromCookies;
	export let isLoggedIn: boolean;

	$: userRole = userData?.job;
	$: isVendedorExterno = userRole === 'Vendedor Externo';
</script>

<header
	class="z-2 static top-0 flex h-14 w-full items-center justify-between gap-4 border-b border-secondary px-3 md:pl-24 md:pr-10"
>
	<!-- Menu Mobile -->
	<Sheet.Root>
		<Sheet.Trigger asChild let:builder>
			<Button builders={[builder]} size="icon" variant="outline" class="sm:hidden">
				<PanelLeft class="h-5 w-5" />
				<span class="sr-only">Toggle Menu</span>
			</Button>
		</Sheet.Trigger>

		<Sheet.Content side="left" class="sm:max-w-xs">
			<nav class="flex w-2/3 flex-col items-center gap-5 rounded-xl">
				<a href="/">
					<img src={LogoHimarte} alt="Logo Himarte" class="w-36 py-5 pr-5" />
				</a>
				<Button
					variant="ghost"
					href="/"
					class={$page.url.pathname === '/' ? 'bg-secondary text-accent-foreground' : ''}
					>Home</Button
				>
				{#if isLoggedIn && isVendedorExterno}
					<Button
						variant="ghost"
						href="/dashboard"
						class={$page.url.pathname === '/dashboard' ? 'bg-secondary text-accent-foreground' : ''}
						>Dashboard</Button
					>
				{/if}
			</nav>
		</Sheet.Content>
	</Sheet.Root>

	<!-- Menu Desktop -->
	<nav class="hidden w-2/3 items-center gap-5 md:flex">
		{#if !isLoggedIn}
			<a href="/">
				<img src={LogoHimarte} alt="Logo Himarte" class="w-36 py-5 pr-5" />
			</a>
		{/if}

		{#if isLoggedIn}
			<Button
				variant="ghost"
				href="/"
				class={$page.url.pathname === '/' ? 'bg-secondary text-accent-foreground' : ''}>Home</Button
			>
			{#if isVendedorExterno}
				<Button
					variant="ghost"
					href="/dashboard"
					class={$page.url.pathname === '/dashboard' ? 'bg-secondary text-accent-foreground' : ''}
					>Dashboard</Button
				>
			{/if}
		{/if}
	</nav>

	<!-- Ações do Usuário -->
	<nav class="flex w-1/3 items-center justify-end gap-24">
		{#if isLoggedIn}
			{#if isVendedorExterno}
				<p class="hidden gap-2 text-orange-500 lg:flex">
					Seu Codigo: <span class="text-white">{userData.promoCode}</span>
				</p>
			{/if}
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
		{/if}
	</nav>
</header>
