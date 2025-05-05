<script lang="ts">
	import '../app.pcss';
	import { Toaster } from '$lib/components/ui/sonner';
	import type { LayoutData } from './$types';
	import type { userDataFromCookies } from '$lib/server/lucia.server';
	import NovoSide from '$lib/components/layouts/SideBar.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import PrimeiroLogin from '$lib/components/Dialogs/PrimeiroLogin.svelte';
	import { page } from '$app/stores';

	export let data: LayoutData;
	export let isLoggedIn = data.isUserLoggedIn;
	export let userData = data.user;

	$: isLoggedIn = data.isUserLoggedIn as boolean;
	$: userData = data.user as userDataFromCookies;

	$: showPrimeiroLogin =
		userData?.job === 'Vendador Externo' ||
		!userData?.cpf ||
		!userData?.telefone ||
		!userData?.pixCode ||
		!userData?.pixType;
</script>

<Toaster richColors closeButton />
<ModeWatcher defaultMode={'dark'} />

<!-- <NovoHeader {isLoggedIn} {userData} /> -->

<main class="flex h-full w-full {isLoggedIn ? 'pl-[3.5rem]' : ''} relative">
	{#if isLoggedIn && userData}
		{#if showPrimeiroLogin}
			<PrimeiroLogin {userData} />
		{:else}
			{#if userData?.promoCode && userData?.job === 'Vendedor Externo'}
				<div
					class="absolute right-2 top-2 z-50 flex justify-center rounded-xl {$page.url.pathname ===
						'/configuracoes' || $page.url.pathname === '/configuracoes/privacidade'
						? 'hidden'
						: 'flex'} border border-border px-4 py-1 text-lg font-bold text-orange-500"
				>
					<span class="mr-2 select-none text-white">Código de indicação: </span>
					<a href="/configuracoes" class="text-orange-500">
						{userData?.promoCode || 'Não possui'}
					</a>
				</div>
			{/if}
			<NovoSide {userData} />
			<slot {userData} />
		{/if}
	{:else}
		<slot {userData} />
	{/if}
</main>
