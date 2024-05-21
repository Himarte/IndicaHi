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

<ScrollArea class=" flex max-h-min w-72  ">
	<h1 class="mb-5 text-3xl font-medium">Configurações</h1>

	<div class="flex flex-col gap-1 pr-7">
		{#each links as { name, href }}
			<Button
				variant="ghost"
				{href}
				class="justify-start text-sm {$currentPath === href
					? 'bg-background text-accent-foreground'
					: ''}"
			>
				{name}
			</Button>
		{/each}
	</div>
</ScrollArea>
