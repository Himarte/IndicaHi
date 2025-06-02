<script lang="ts">
	import type { userDataFromCookies } from '$lib/server/lucia.server';
	import { ROUTES } from '$lib/uteis/routes';

	export let userData: userDataFromCookies;
</script>

<div
	class="absolute right-2 top-2 z-50 flex justify-center rounded-xl border border-border px-4 py-1 text-lg font-bold text-orange-500"
>
	<span class="mr-2 select-none text-white">Código de indicação: </span>
	<a href={ROUTES.CONFIGURACOES} class="text-orange-500">
		{userData?.promoCode || 'Não possui'}
	</a>
</div>
