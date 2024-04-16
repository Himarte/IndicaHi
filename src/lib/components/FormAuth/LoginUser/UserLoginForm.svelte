<script lang="ts">
	import Reload from 'svelte-radix/Reload.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { cn } from '$lib/utils';
	import { enhance } from '$app/forms';

	let className: string | undefined | null = undefined;
	export { className as class };

	let isLoading = false;
	async function carregando() {
		isLoading = true;

		setTimeout(() => {
			isLoading = false;
		}, 1000);
	}
</script>

<div class={cn('grid gap-6', className)} {...$$restProps}>
	<form
		method="post"
		use:enhance={() => {
			return async ({ update }) => {
				await carregando();
				update();
			};
		}}
	>
		<div class="flex flex-col items-center gap-2">
			<Input
				id="email"
				placeholder="name@example.com"
				type="email"
				autocapitalize="none"
				autocomplete="email"
				autocorrect="off"
				disabled={isLoading}
				name="email"
				class="z-[4] bg-background"
			/>
			<Input
				type="password"
				id="password"
				name="password"
				placeholder="Senha"
				class="z-[4] bg-background"
				disabled={isLoading}
			/>
			<Button disabled={isLoading} type="submit" class="mt-3 flex w-1/2 ">
				{#if isLoading}
					<Reload class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Entrar
			</Button>
		</div>
	</form>
</div>
