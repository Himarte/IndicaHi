<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-10 text-2xl">
	<div
		class="flex w-1/5 flex-col items-center justify-center rounded-xl border border-border py-5 text-2xl"
	>
		<span>Bem Vindo ao </span>
		<span>Sistema de Indicações da</span>
		<span class="font-bold text-orange-500">HIMARTE</span>
	</div>
	<div class="flex w-full flex-col items-center justify-center">
		<p class=" text-center">Você pode monitorar</p>
		<p class="pb-2 text-center">os leads que você indicou aqui.</p>
		<Button href="/dashboard" variant="default">Seu Dashboard</Button>
	</div>
</div>
