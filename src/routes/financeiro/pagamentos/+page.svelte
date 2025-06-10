<script lang="ts">
	import type { PageData } from './$types';

	import emConstrucao from '$lib/img/UnderConstruction.gif';
	interface Props {
		data: PageData;
		user?: any;
	}

	let { data, user = data.user }: Props = $props();
</script>

<div class="flex w-full flex-col items-center justify-center gap-10">
	<div class="flex w-full flex-col items-center justify-center">
		<h1 class="text-2xl font-bold">Lista de pagamentos</h1>
		<h2 class="text-lg">
			Realizados pelo usuário <span class="text-orange-400">{user?.name}</span>
		</h2>
	</div>
	<img src={emConstrucao} alt="Em construção" loading="lazy" class="w-1/5" />
</div>
