<script lang="ts">
	import '../app.pcss';
	import { Toaster } from '$lib/components/ui/sonner';
	import type { LayoutData } from './$types';
	import type { userDataFromCookies } from '$lib/server/lucia.server';
	import NovoSide from '$lib/components/layouts/SideBar.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import PrimeiroLogin from '$lib/components/Dialogs/PrimeiroLogin.svelte';
	import VendedorExternoElements from '$lib/components/layouts/VendedorExternoElements.svelte';
	import { needsFirstLogin } from '$lib/uteis/userValidation';

	export let data: LayoutData;

	$: isLoggedIn = data.isUserLoggedIn as boolean;
	$: userData = data.user as userDataFromCookies;
	$: showFirstLogin = needsFirstLogin(userData);
</script>

<Toaster richColors closeButton />
<ModeWatcher defaultMode={'dark'} />

<main class="flex h-full w-full {isLoggedIn ? 'md:pl-[3.5rem]' : ''} relative">
	{#if isLoggedIn && userData}
		{#if showFirstLogin}
			<PrimeiroLogin {userData} />
		{:else}
			<!-- Elementos específicos do vendedor externo -->
			<VendedorExternoElements {userData} />

			<!-- Sidebar -->
			<NovoSide {userData} />

			<!-- Conteúdo da página -->
			<slot {userData} />
		{/if}
	{:else}
		<slot {userData} />
	{/if}
</main>
