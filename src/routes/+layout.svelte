<script lang="ts">
	import '../app.pcss';
	import NavBar from '$lib/components/NavBar/NavBar.svelte';
	import { Toaster } from '$lib/components/ui/sonner';

	import type { LayoutData } from './$types';
	import type { userDataFromCookies } from '$lib/server/lucia.server';

	export let data: LayoutData;
	export let isLoggedIn = data.isUserLoggedIn;
	export let userData = data.user;
	// This is a special layout file that will be used for all routes.
	$: isLoggedIn = data.isUserLoggedIn as boolean;
	$: userData = data.user as userDataFromCookies;
</script>

<Toaster richColors closeButton />

<NavBar {isLoggedIn} {userData} />

<slot><!-- optional fallback --></slot>
