<script lang="ts">
	import type { userDataFromCookies } from '$lib/server/lucia.server';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '../ui/button';

	export let userData: userDataFromCookies;
</script>

<div class="absolute z-20 flex h-full w-full items-center justify-center bg-primary-foreground/90">
	<Card.Root class="flex h-1/2 w-1/3 flex-col">
		<Card.Header class="text-center">
			<Card.Title class="text-xl">Bem vindo!</Card.Title>
			<Card.Description class="text-md"
				>Prencha alguns dados para podermos continuar</Card.Description
			>
		</Card.Header>
		<Card.Content class="flex h-full w-full">
			<p>Card Content</p>
		</Card.Content>
		<Card.Footer class="flex  w-full justify-between">
			<Button>Voltar</Button>

			<Button>Proximo</Button>
		</Card.Footer>
	</Card.Root>
</div>
