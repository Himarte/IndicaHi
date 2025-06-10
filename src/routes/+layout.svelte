<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import type { LayoutData } from './$types';
	import type { User } from '$lib/server/auth';
	import NovoSide from '$lib/components/layouts/SideBar.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import PrimeiroLogin from '$lib/components/Dialogs/PrimeiroLogin.svelte';
	import VendedorExternoElements from '$lib/components/layouts/VendedorExternoElements.svelte';
	import { needsFirstLogin } from '$lib/uteis/userValidation';

	interface Props {
		data: LayoutData;
		children?: import('svelte').Snippet<[any]>;
	}

	let { data, children }: Props = $props();

	let isLoggedIn = $derived(data.isUserLoggedIn as boolean);
	let userData = $derived(data.user as User);
	let showFirstLogin = $derived(needsFirstLogin(userData));
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
			{@render children?.({ userData })}
		{/if}
	{:else}
		{@render children?.({ userData })}
	{/if}
</main>
