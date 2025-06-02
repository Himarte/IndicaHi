<script lang="ts">
	import { page } from '$app/stores';
	import type { userDataFromCookies } from '$lib/server/lucia.server';
	import { routeHelpers } from '$lib/uteis/routes';
	import { isExternalSellerWithPromo } from '$lib/uteis/userValidation';
	import BonusIndicador from './BonusIndicador.svelte';
	import CodigoIndicacao from './CodigoIndicacao.svelte';

	export let userData: userDataFromCookies;

	// Lógica simplificada usando os helpers
	$: currentPath = $page.url.pathname;
	$: shouldShowCodigoIndicacao = routeHelpers.isDashboardRoute(currentPath);
	$: shouldShowBonusIndicador = routeHelpers.shouldShowBonus(currentPath);
	$: canShowElements = isExternalSellerWithPromo(userData);
</script>

{#if canShowElements}
	{#if shouldShowCodigoIndicacao}
		<CodigoIndicacao {userData} />
	{/if}

	{#if shouldShowBonusIndicador}
		<BonusIndicador {userData} />
	{/if}
{/if}
