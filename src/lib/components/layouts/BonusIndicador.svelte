<script lang="ts">
	import { CircleCheck } from '@lucide/svelte';
	import { Circle } from '@lucide/svelte';
	import { Separator } from '../ui/separator';
	import type { User } from '$lib/server/auth';
	import { ROUTES } from '$lib/uteis/routes';

	export let userData: User;
	let bonusIndicacao = userData.bonusIndicacao || 0;
</script>

<a href={ROUTES.DASHBOARD_RECOMPENSA}>
	<div
		class="absolute top-3 left-24 z-50 flex w-fit items-center transition-all duration-300 hover:scale-105"
	>
		<CircleCheck class="h-7 w-7 text-green-500" />

		{#each Array(5) as _, i}
			{#if bonusIndicacao > i}
				<Separator
					class="bg-green-500 data-[orientation=horizontal]:h-[3px] data-[orientation=horizontal]:w-2"
				/>
			{:else}
				<Separator
					class="bg-gray-500 data-[orientation=horizontal]:h-[3px] data-[orientation=horizontal]:w-2"
				/>
			{/if}
		{/each}

		{#if bonusIndicacao >= 5}
			<CircleCheck class="h-7 w-7 text-green-500" />
		{:else}
			<Circle class="h-7 w-7 text-gray-500" />
		{/if}

		{#each Array(5) as _, i}
			{#if bonusIndicacao >= 5 && bonusIndicacao > i + 5}
				<Separator
					class="bg-green-500 data-[orientation=horizontal]:h-[3px] data-[orientation=horizontal]:w-2"
				/>
			{:else}
				<Separator
					class="bg-gray-500 data-[orientation=horizontal]:h-[3px] data-[orientation=horizontal]:w-2"
				/>
			{/if}
		{/each}

		{#if bonusIndicacao >= 10}
			<CircleCheck class="h-7 w-7 text-green-500" />
		{:else}
			<Circle class="h-7 w-7 text-gray-500" />
		{/if}

		{#each Array(5) as _, i}
			{#if bonusIndicacao >= 10 && bonusIndicacao > i + 10}
				<Separator
					class="bg-green-500 data-[orientation=horizontal]:h-[3px] data-[orientation=horizontal]:w-2"
				/>
			{:else}
				<Separator
					class="bg-gray-500 data-[orientation=horizontal]:h-[3px] data-[orientation=horizontal]:w-2"
				/>
			{/if}
		{/each}

		{#if bonusIndicacao >= 15}
			<CircleCheck class="h-7 w-7 text-green-500" />
		{:else}
			<Circle class="h-7 w-7 text-gray-500" />
		{/if}

		{#each Array(5) as _, i}
			{#if bonusIndicacao >= 15 && bonusIndicacao > i + 15}
				<Separator
					class="bg-green-500 data-[orientation=horizontal]:h-[3px] data-[orientation=horizontal]:w-2"
				/>
			{:else}
				<Separator
					class="bg-gray-500 data-[orientation=horizontal]:h-[3px] data-[orientation=horizontal]:w-2"
				/>
			{/if}
		{/each}

		{#if bonusIndicacao >= 20}
			<CircleCheck class="h-7 w-7 text-green-500" />
		{:else}
			<Circle class="h-7 w-7 text-gray-500" />
		{/if}
	</div>
</a>
