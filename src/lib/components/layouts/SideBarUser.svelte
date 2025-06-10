<script lang="ts">
	import { page } from '$app/stores';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import Button from '../ui/button/button.svelte';
	import { USER_CONFIG_LINKS } from '$lib/uteis/routes';
</script>

<ScrollArea class="flex max-h-min w-full text-center md:w-72 md:text-left">
	<h1 class="mb-5 text-3xl font-medium">Configurações</h1>

	<div
		class="flex w-fit flex-row gap-2 rounded-md border border-zinc-600/50 p-1 md:w-full md:flex-col md:border-none md:py-2 md:pr-7"
	>
		{#each USER_CONFIG_LINKS as { name, href }}
			<Button
				variant="ghost"
				{href}
				class="justify-center text-sm md:justify-start {$page.url.pathname === href
					? 'bg-secondary text-accent-foreground'
					: ''}"
			>
				{name}
			</Button>
		{/each}
	</div>
</ScrollArea>
