<script lang="ts">
	import PanelLeft from 'lucide-svelte/icons/panel-left';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import LogoHimarte from '$lib/img/logos/logo-nome.webp';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as Popover from '$lib/components/ui/popover';
	import type { userDataFromCookies } from '$lib/server/lucia.server';
	import AvatarOpcoes from '../NavBar/AvatarOpcoes.svelte';

	// Pops
	export let userData: userDataFromCookies;
	export let isLoggedIn: boolean;
	$: isLoggedIn;
	$: userData;
</script>

<header
	class="sticky top-0 z-30 flex h-10 w-full items-center gap-4 border-b px-4 pt-3 sm:static sm:h-auto sm:border-0 sm:pl-24 sm:pr-6"
>
	<Sheet.Root>
		<Sheet.Trigger asChild let:builder>
			<Button builders={[builder]} size="icon" variant="outline" class="sm:hidden">
				<PanelLeft class="h-5 w-5" />
				<span class="sr-only">Toggle Menu</span>
			</Button>
		</Sheet.Trigger>
		<!-- No mobile -->
		<Sheet.Content side="left" class=" sm:max-w-xs">
			<nav class="flex w-2/3 flex-col items-center gap-5 rounded-xl">
				<a href="/"> <img src={LogoHimarte} alt="Logo Himarte" class=" w-36 py-5 pr-5" /></a>
				<Button variant="ghost" href="/">Home</Button>
				<Button variant="ghost" href="/teste">Teste</Button>
				{#if isLoggedIn}
					<Button variant="ghost" href="/dashboard/indicacoes/pendentes">Dashboard</Button>
				{/if}
			</nav>
		</Sheet.Content>
	</Sheet.Root>
	<!-- No desktop -->
	<nav class=" hidden w-2/3 items-center gap-5 md:flex">
		{#if !isLoggedIn}
			<a href="/"> <img src={LogoHimarte} alt="Logo Himarte" class="w-36 py-5 pr-5" /></a>
		{/if}
		<Button variant="ghost" href="/">Home</Button>
		{#if isLoggedIn}
			<Button variant="ghost" href="/dashboard/indicacoes/pendentes">Dashboard</Button>
		{/if}
	</nav>
	<!--Pesquisa -->
	<nav class="flex w-1/3 items-center justify-end gap-24">
		{#if isLoggedIn}
			<p class="hidden gap-2 text-orange-500 lg:flex">
				Seu Codigo: <span class="text-white"> {userData.promoCode}</span>
			</p>
			<Popover.Root>
				<Popover.Trigger
					><Avatar.Root class="h-8 w-8">
						<Avatar.Image src={userData.avatarUrl} alt="Avatar do Usuario" />
						<Avatar.Fallback>HM</Avatar.Fallback>
					</Avatar.Root></Popover.Trigger
				>
				<Popover.Content class=" mt-3 flex flex-col"><AvatarOpcoes /></Popover.Content>
			</Popover.Root>
		{/if}
	</nav>
</header>
