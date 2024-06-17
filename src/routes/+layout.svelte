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

	console.log(data);

	export let isLoggedIn = data.isUserLoggedIn;
	export let userData = data.user;

	$: isLoggedIn = data.isUserLoggedIn as boolean;
	$: userData = data.user as userDataFromCookies;
</script>

<Toaster richColors closeButton />
<ModeWatcher defaultMode={'dark'} />

<NovoHeader {isLoggedIn} {userData} />

{#if isLoggedIn}
	{#if userData.job === 'Vendador Externo' || !userData.cpf || !userData.telefone || !userData.pixCode || !userData.pixType}
		<PrimeiroLogin {userData} />
	{/if}
	<main class="flex h-full w-full pl-[3.5rem]">
		<NovoSide />
		<slot />
	</main>
{:else}
	<main class="flex h-full w-full">
		<slot><!-- optional fallback --></slot>
	</main>
{/if}
