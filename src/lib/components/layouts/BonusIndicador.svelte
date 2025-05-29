<script lang="ts">
	import { CircleCheck } from 'lucide-svelte';
	import { Circle } from 'lucide-svelte';
	import { Separator } from '../ui/separator';
	import type { userDataFromCookies } from '$lib/server/lucia.server';
	export let userData: userDataFromCookies;
	let bonusIndicacao = userData.bonusIndicacao;
</script>

<a href="/dashboard/recompensa">
	<div class="absolute left-24 top-1 z-50 flex w-fit flex-col items-center gap-1">
		<div class="flex items-center justify-center gap-3">
			<h1 class="text-xl font-bold">Bonus de indicação</h1>
			<p class="text-md font-semibold">
				{bonusIndicacao}
				/ 20
			</p>
		</div>
		<div class="flex items-center">
			<CircleCheck class="h-7 w-7 text-green-500" />

			{#each Array(5) as _, i}
				{#if bonusIndicacao > i}
					<Separator class="h-[3px] w-2 bg-green-500" />
				{:else}
					<Separator class="h-[3px] w-2 bg-gray-500" />
				{/if}
			{/each}

			{#if bonusIndicacao >= 5}
				<CircleCheck class="h-7 w-7 text-green-500" />
			{:else}
				<Circle class="h-7 w-7 text-gray-500" />
			{/if}

			{#each Array(5) as _, i}
				{#if bonusIndicacao >= 5 && bonusIndicacao > i + 5}
					<Separator class="h-[3px] w-2 bg-green-500" />
				{:else}
					<Separator class="h-[3px] 	w-2 bg-gray-500" />
				{/if}
			{/each}

			{#if bonusIndicacao >= 10}
				<CircleCheck class="h-7 w-7 text-green-500" />
			{:else}
				<Circle class="h-7 w-7 text-gray-500" />
			{/if}

			{#each Array(5) as _, i}
				{#if bonusIndicacao >= 10 && bonusIndicacao > i + 10}
					<Separator class="h-[3px] w-2 bg-green-500" />
				{:else}
					<Separator class="h-[3px] w-2 bg-gray-500" />
				{/if}
			{/each}

			{#if bonusIndicacao >= 15}
				<CircleCheck class="h-7 w-7 text-green-500" />
			{:else}
				<Circle class="h-7 w-7 text-gray-500" />
			{/if}

			{#each Array(5) as _, i}
				{#if bonusIndicacao >= 15 && bonusIndicacao > i + 15}
					<Separator class="h-[3px] w-2 bg-green-500" />
				{:else}
					<Separator class="h-[3px] w-2 bg-gray-500" />
				{/if}
			{/each}

			{#if bonusIndicacao >= 20}
				<CircleCheck class="h-7 w-7 text-green-500" />
			{:else}
				<Circle class="h-7 w-7 text-gray-500" />
			{/if}
		</div>
	</div>
</a>
