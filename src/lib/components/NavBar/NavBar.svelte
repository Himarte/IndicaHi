<script lang="ts">
	import LogoHimarte from '$lib/img/logos/logo-nome.webp';
	import { ModeWatcher } from 'mode-watcher';
	import { Button } from '../ui/button';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	export let isLoggedIn: boolean;
	import * as Popover from '$lib/components/ui/popover';
	import AvatarOpcoes from './AvatarOpcoes.svelte';
	import Bell from 'lucide-svelte/icons/bell';
	export let userPromoCode: string;
	$: userPromoCode = userPromoCode;
</script>

<ModeWatcher />
<header
	class="sticky top-0 z-30 flex h-14 w-full items-center border-b border-border bg-background px-44 backdrop-blur supports-[backdrop-filter]:bg-background/80"
>
	<nav class="flex w-2/3 items-center gap-5 rounded-xl">
		<a href="/"> <img src={LogoHimarte} alt="Logo Himarte" class="  w-36 py-5 pr-5" /></a>

		<Button variant="ghost" href="/">Home</Button>
		<Button variant="ghost" href="/teste">Teste</Button>
		{#if isLoggedIn}
			<Button variant="ghost" href="/dashboard/indicacoes/pendentes">Dashboard</Button>
		{/if}
	</nav>

	<nav class="flex w-1/3 items-center justify-end gap-24">
		{#if isLoggedIn}
			<p class="hidden gap-2 text-orange-500 lg:flex">
				Seu Codigo: <span class="text-white"> {userPromoCode}</span>
			</p>
			<div class="gap flex items-center gap-5">
				<Bell />
				<Popover.Root>
					<Popover.Trigger
						><Avatar.Root>
							<Avatar.Fallback>HM</Avatar.Fallback>
						</Avatar.Root></Popover.Trigger
					>
					<Popover.Content class=" mt-3 flex flex-col"><AvatarOpcoes /></Popover.Content>
				</Popover.Root>
			</div>
		{:else}
			<nav class="flex gap-3">
				<Button variant="outline" href="/login">Login</Button>
				<Button href="/registrar">Registrar</Button>
			</nav>
		{/if}
	</nav>
</header>
