<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';

	let link = [
		{
			name: 'Perfil',
			href: '/perfil'
		},
		{
			name: 'Configuraçoes',
			href: '/perfil/configuracoes '
		}
	];
</script>

<h1 class="px-72 py-7 text-3xl font-medium">Dados da sua conta</h1>
<Separator />
<div class="flex h-full w-full px-72 py-5">
	<ScrollArea class="h-72 w-72">
		<div class="flex flex-col pr-7">
			{#each link as link}
				<Button variant="ghost" class="justify-start text-sm " href={link.href}>
					{link.name}
				</Button>
			{/each}
		</div>
	</ScrollArea>
	<div class="flex h-full w-full flex-col gap-5">
		<slot><!-- optional fallback --></slot>
	</div>
</div>
