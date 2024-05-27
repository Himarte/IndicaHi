<script lang="ts">
	import { page } from '$app/stores';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import Button from '../ui/button/button.svelte';

	let links = [
		{
			name: 'Perfil',
			href: '/configuracoes'
		},
		{
			name: 'Privacidade',
			href: '/configuracoes/privacidade'
		}
	];
</script>

<ScrollArea class=" flex max-h-min w-72  ">
	<h1 class="mb-5 text-3xl font-medium">Configurações</h1>

	<div class="flex flex-col gap-1 pr-7">
		{#each links as { name, href }}
			<Button
				variant="ghost"
				{href}
				class="justify-start text-sm {$page.url.pathname === href
					? 'bg-secondary text-accent-foreground'
					: ''}"
			>
				{name}
			</Button>
		{/each}
	</div>
</ScrollArea>
