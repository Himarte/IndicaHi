<script lang="ts">
	import { page } from '$app/stores';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { derived } from 'svelte/store';
	import Button from '../ui/button/button.svelte';

	let links = [
		{
			name: 'Perfil',
			href: '/perfil'
		},
		{
			name: 'Configuraçoes',
			href: '/perfil/configuracoes'
		}
	];

	let currentPath = derived(page, ($page) => $page.url.pathname);

	$: currentPath = currentPath;
</script>

<ScrollArea class="h-72 w-72">
	<div class="flex flex-col gap-1 pr-7">
		{#each links as { name, href }}
			<Button
				variant="ghost"
				{href}
				class="justify-start text-sm {$currentPath === href
					? 'bg-accent text-accent-foreground'
					: ''}"
			>
				{name}
			</Button>
		{/each}
	</div>
</ScrollArea>
