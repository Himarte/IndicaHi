<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let userJob = data.user?.job;
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-10 text-2xl">
	<div
		class="border-border flex w-1/5 flex-col items-center justify-center rounded-xl border py-5 text-2xl"
	>
		<span>Bem Vindo ao </span>
		<span>Sistema de Indicações da</span>
		<span class="font-bold text-orange-500">HIMARTE</span>
	</div>

	{#if userJob === 'Vendedor Externo'}
		<Button href="/dashboard" variant="default">Seu Dashboard</Button>
	{:else if userJob === 'Vendedor Interno'}
		<Button href="/interno" variant="default">Seu Dashboard</Button>
	{:else if userJob === 'Financeiro'}
		<Button href="/financeiro" variant="default">Seu Dashboard</Button>
	{:else if userJob === 'Admin'}
		<Button href="/admin" variant="default">Seu Dashboard</Button>
	{/if}
</div>
