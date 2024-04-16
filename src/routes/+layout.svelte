<script lang="ts">
	import '../app.pcss';
	import NavBar from '$lib/components/NavBar/NavBar.svelte';
	import { Toaster } from '$lib/components/ui/sonner';

	import type { LayoutData } from './$types';

	export let data: LayoutData;
	let isLoggedIn: boolean = data.isUserLoggedIn;
	let userPromoCode: string = data.user?.promoCode ?? '';

	// This is a special layout file that will be used for all routes.
	$: isLoggedIn = data.isUserLoggedIn;
	$: userPromoCode = data.user?.promoCode ?? '';
</script>

<Toaster richColors closeButton />

<NavBar {isLoggedIn} {userPromoCode} />

<slot><!-- optional fallback --></slot>
