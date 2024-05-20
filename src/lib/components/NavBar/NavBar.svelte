<script lang="ts">
	import LogoHimarte from '$lib/img/logos/logo-nome.webp';
	import { ModeWatcher } from 'mode-watcher';
	import { Button } from '../ui/button';

	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as Popover from '$lib/components/ui/popover';
	import AvatarOpcoes from './AvatarOpcoes.svelte';
	import Bell from 'lucide-svelte/icons/bell';
	import ModalGerarPromocode from '../Dialogs/ModalGerarPromocode.svelte';
	import type { userDataFromCookies } from '$lib/server/lucia.server';

	// Pops
	export let userData: userDataFromCookies;
	export let isLoggedIn: boolean;
	$: isLoggedIn;
	$: userData;
</script>

<ModeWatcher defaultMode={'dark'} />
<header
	class="sticky top-0 z-30 flex h-14 w-full items-center border-b border-border bg-background px-44 backdrop-blur supports-[backdrop-filter]:bg-background/80"
>
	<nav class="flex w-2/3 items-center gap-5 rounded-xl">
		<a href="/"> <img src={LogoHimarte} alt="Logo Himarte" class=" w-36 py-5 pr-5" /></a>

		<Button variant="ghost" href="/">Home</Button>
		<Button variant="ghost" href="/teste">Teste</Button>
		{#if isLoggedIn}
			<Button variant="ghost" href="/dashboard/indicacoes/pendentes">Dashboard</Button>
		{/if}
	</nav>
	<!-- Teste -->
	<nav class="flex w-1/3 items-center justify-end gap-24">
		{#if isLoggedIn}
			{#if !userData.promoCode}
				<p class="hidden gap-2 text-orange-500 lg:flex">
					Seu Codigo: <span class="text-white"> {userData.promoCode}</span>
				</p>
			{:else}
				<ModalGerarPromocode texto="Crie seu codigo aqui" />
			{/if}
			<div class="gap flex items-center gap-5">
				<Bell />
				<Popover.Root>
					<Popover.Trigger
						><Avatar.Root>
							<Avatar.Image src={userData.avatarUrl} alt="Avatar do Usuario" />
							<Avatar.Fallback>HM</Avatar.Fallback>
						</Avatar.Root></Popover.Trigger
					>
					<Popover.Content class=" mt-3 flex flex-col"><AvatarOpcoes /></Popover.Content>
				</Popover.Root>
			</div>
		{:else}
			<Button variant="outline" class="w-28" href="/login">Login</Button>
		{/if}
	</nav>
</header>
