<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { derived } from 'svelte/store';

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

<h1 class="px-72 py-7 text-3xl font-medium">Dados da sua conta</h1>
<Separator />
<div class="flex h-full w-full px-72 py-5">
	<ScrollArea class="h-72 w-72">
		<div class="flex flex-col pr-7">
			{#each links as { name, href }}
				<a {href} class="justify-start text-sm {$currentPath === href ? 'bg-gray-500' : ''}">
					{name}
				</a>
			{/each}
		</div>
	</ScrollArea>
	<div class="flex h-full w-full flex-col gap-5">
		<slot><!-- optional fallback --></slot>
	</div>
</div>
