<script lang="ts">
	import '../app.pcss';
	import { Toaster } from '$lib/components/ui/sonner';

	import type { LayoutData } from './$types';
	import type { userDataFromCookies } from '$lib/server/lucia.server';
	import NovoHeader from '$lib/components/Novo/NovoHeader.svelte';
	import NovoSide from '$lib/components/Novo/NovoSide.svelte';
	import { ModeWatcher } from 'mode-watcher';

	export let data: LayoutData;
	export let isLoggedIn = data.isUserLoggedIn;
	export let userData = data.user;
	// This is a special layout file that will be used for all routes.
	$: isLoggedIn = data.isUserLoggedIn as boolean;
	$: userData = data.user as userDataFromCookies;
</script>

<Toaster richColors closeButton />
<ModeWatcher defaultMode={'dark'} />

<!-- <NavBar {isLoggedIn} {userData} /> -->
<NovoHeader {isLoggedIn} {userData} />
{#if isLoggedIn}
	<!-- Se estiver logado carrega esse -->
	<main class="flex h-full w-full pl-[3.5rem]">
		<NovoSide />
		<slot><!-- optional fallback --></slot>
	</main>
{:else}
	<!-- Senao estiver logado carrega esse -->
	<main class="flex h-full w-full">
		<slot><!-- optional fallback --></slot>
	</main>
{/if}
