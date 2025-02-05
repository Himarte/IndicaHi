<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Textarea } from './ui/textarea';
	import { onMount } from 'svelte';

	export let leadId: string;
	let motivo = '';
	let error = '';
	let loading = true;

	onMount(async () => {
		try {
			const response = await fetch(`/api/leads/motivo-cancelamento/${leadId}`);
			const data = await response.json();

			if (response.ok && data.success) {
				motivo = data.motivo;
			} else {
				error = data.message;
				console.error('Erro ao buscar motivo:', data.message);
			}
		} catch (error) {
			console.error('Erro ao buscar motivo do cancelamento:', error);
			error = 'Erro ao carregar o motivo';
		} finally {
			loading = false;
		}
	});
</script>

<Popover.Root portal={null}>
	<Popover.Trigger asChild let:builder>
		<Button builders={[builder]} class="text-xs" variant="link">Ver Motivo</Button>
	</Popover.Trigger>
	<Popover.Content class="w-80 pt-2">
		<div class="flex flex-col items-center justify-center gap-2">
			<p class="text-sm font-bold text-orange-400">Motivo do Cancelamento</p>
			{#if loading}
				<p class="text-sm">Carregando...</p>
			{:else if error}
				<p class="text-sm text-red-500">{error}</p>
			{:else if motivo}
				<Textarea
					class="min-h-[100px]  resize-none border-orange-400 focus-visible:ring-0"
					value={motivo}
					readonly
				/>
			{:else}
				<p class="text-sm text-gray-500">Nenhum motivo registrado</p>
			{/if}
		</div>
	</Popover.Content>
</Popover.Root>
