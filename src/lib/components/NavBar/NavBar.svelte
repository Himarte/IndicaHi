<script lang="ts">
	import LogoHimarte from '$lib/img/logos/logo-nome.webp';
	import { ModeWatcher } from 'mode-watcher';
	import { Button } from '../ui/button';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	export let isLoggedIn: boolean;
	import * as Popover from '$lib/components/ui/popover';
	import AvatarOpcoes from './AvatarOpcoes.svelte';
	export let userPromoCode: string;
</script>

<ModeWatcher />
<header
	class="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background px-5 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-5"
>
	<img src={LogoHimarte} alt="Logo Himarte" class="w-36 p-5" />
	<nav class="hidden items-center gap-5 rounded-xl p-3 md:flex">
		<Button variant="ghost" href="/">Home</Button>
		<Button variant="ghost" href="/teste">Teste</Button>
		{#if isLoggedIn}
			<Button variant="ghost" href="/dashboard/indicacoes/pendentes">Dashboard</Button>
		{/if}
	</nav>

	<nav class="flex gap-5">
		{#if isLoggedIn}
			<Popover.Root>
				<Popover.Trigger
					><Avatar.Root>
						<Avatar.Fallback>HM</Avatar.Fallback>
					</Avatar.Root></Popover.Trigger
				>
				<Popover.Content><AvatarOpcoes /></Popover.Content>
			</Popover.Root>
		{:else}
			<nav class="flex gap-3">
				<Button variant="outline" href="/login">Login</Button>
				<Button href="/registrar">Registrar</Button>
			</nav>
		{/if}
	</nav>
</header>
