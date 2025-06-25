<script lang="ts">
	import type { User } from '$lib/server/auth';
	import { ROUTES } from '$lib/uteis/routes';

	export let userData: User;
</script>

<div
	class="border-border absolute top-2 right-2 z-50 flex justify-center rounded-xl border px-4 py-1 text-lg font-bold text-orange-500"
>
	<span class="mr-2 text-white select-none">Código de indicação: </span>
	<a href={ROUTES.CONFIGURACOES} class="text-amber-500">
		{userData?.promoCode || 'Não possui'}
	</a>
</div>
