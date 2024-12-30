<script lang="ts">
	import '../app.pcss';
	import { Toaster } from '$lib/components/ui/sonner';
	import type { LayoutData } from './$types';
	import type { userDataFromCookies } from '$lib/server/lucia.server';
	import NovoHeader from '$lib/components/layouts/header/NovoHeader.svelte';
	import NovoSide from '$lib/components/layouts/NovoSide.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import PrimeiroLogin from '$lib/components/Dialogs/PrimeiroLogin.svelte';

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

<NovoHeader {isLoggedIn} {userData} />

<main class="flex h-full w-full {isLoggedIn ? 'pl-[3.5rem]' : ''}">
	{#if isLoggedIn && userData}
		{#if showPrimeiroLogin}
			<PrimeiroLogin {userData} />
		{/if}
		<NovoSide {userData} />
		<slot {userData} />
	{:else}
		<slot {userData} />
	{/if}
</main>
