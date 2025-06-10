<script lang="ts">
	import { page } from '$app/stores';
	import type { User } from '$lib/server/auth';
	import { routeHelpers } from '$lib/uteis/routes';
	import { isExternalSellerWithPromo } from '$lib/uteis/userValidation';
	import BonusIndicador from './BonusIndicador.svelte';
	import CodigoIndicacao from './CodigoIndicacao.svelte';

	export let userData: User;

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
