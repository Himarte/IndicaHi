<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { Gift, AlertTriangle } from 'lucide-svelte';
	import type { userDataFromCookies } from '$lib/server/lucia.server';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import Separator from '../ui/separator/separator.svelte';

	export let userData: userDataFromCookies;
	export let open = false;
	export let availableReward: number = 0;

	// Progresso atual do usuário
	$: currentProgress = userData?.bonusIndicacao || 0;

	// Calcular qual milestone será resgatado e quantas indicações serão gastas
	$: milestoneQueSeraResgatado = (() => {
		const milestones = [
			{ referrals: 5, reward: 20 },
			{ referrals: 10, reward: 45 },
			{ referrals: 15, reward: 75 },
			{ referrals: 20, reward: 150 }
		];

		const milestonesResgataveis = milestones
			.filter((m) => currentProgress >= m.referrals && m.reward === availableReward)
			.sort((a, b) => b.referrals - a.referrals);

		return milestonesResgataveis[0] || null;
	})();

	// Estado de loading para o submit
	let isSubmitting = false;

	function cancelarResgate() {
		open = false;
	}
</script>

<AlertDialog.Root bind:open closeOnOutsideClick closeOnEscape>
	<AlertDialog.Content class="max-w-sm border-orange-300/30 md:max-w-md">
		<AlertDialog.Header>
			<AlertDialog.Title
				class="flex w-full items-center justify-center gap-2 text-2xl font-bold text-emerald-400"
			>
				<Gift class="h-6 w-6" />
				Resgatar Recompensa
				<Gift class="h-6 w-6" />
			</AlertDialog.Title>
			<AlertDialog.Description class="text-center text-slate-300">
				Confirme o resgate da sua recompensa acumulada.
			</AlertDialog.Description>
		</AlertDialog.Header>

		<div
			class="my-4 flex flex-col items-center gap-2 rounded-lg border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-orange-500/10 p-4"
		>
			<!-- Valor disponível -->
			<div class="text-center">
				<p class="text-sm text-slate-400">Valor disponível para resgate:</p>
				<p class="text-3xl font-black text-emerald-400">R$ {availableReward}</p>
			</div>

			<!-- Progresso atual -->
			<div class="w-full text-center">
				<p class="text-sm text-slate-300">
					Baseado em suas <span class="font-bold text-orange-400">{currentProgress}</span> indicações
					realizadas
				</p>
			</div>

			{#if milestoneQueSeraResgatado}
				<Separator class="my-2" />
				<div class="b w-full text-center">
					<p class="text-sm text-slate-400">Ao resgatar você usará:</p>
					<p class="text-lg font-bold text-red-400">
						{milestoneQueSeraResgatado.referrals} indicações
					</p>
					<p class="text-xs text-slate-500">
						Indicações restantes:
						<span class="font-bold text-green-400">
							{currentProgress - milestoneQueSeraResgatado.referrals}
						</span>
					</p>
				</div>
			{/if}
		</div>

		{#if availableReward > 0}
			<!-- Informações do resgate -->
			<div class="mb-4 rounded-lg bg-slate-800/50 p-3">
				<div class="flex items-start gap-2">
					<AlertTriangle class="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-400" />
					<div class="text-xs text-slate-300">
						<p class="mb-1 font-semibold text-yellow-400">Informações importantes:</p>
						<ul class="space-y-1">
							<li>• O valor será creditado em até 7 dias úteis</li>
							<li>• As indicações correspondentes serão gastas no resgate</li>
							<li>• Esta ação não pode ser desfeita</li>
						</ul>
					</div>
				</div>
			</div>

			<!-- Form para enviar dados -->
			<form
				method="POST"
				action="?/resgatarRecompensa"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ result, update }) => {
						isSubmitting = false;
						console.log('Form result:', result);
						if (result.type === 'success') {
							toast.success('Resgate processado com sucesso!');
							open = false;
							// Recarregar dados da página para mostrar novo saldo
							await invalidateAll();
						} else if (result.type === 'failure') {
							toast.error('Erro ao processar resgate. Tente novamente.');
						}
						await update();
					};
				}}
			>
				<!-- Campos hidden com os dados -->
				<input type="hidden" name="valorRecompensa" value={availableReward} />
				<input type="hidden" name="quantidadeIndicacoes" value={currentProgress} />
				<input type="hidden" name="userId" value={userData.id} />

				<AlertDialog.Footer class="gap-2">
					<AlertDialog.Cancel asChild let:builder>
						<Button
							builders={[builder]}
							variant="outline"
							on:click={cancelarResgate}
							class="flex-1"
							disabled={isSubmitting}
						>
							Cancelar
						</Button>
					</AlertDialog.Cancel>
					<Button
						type="submit"
						class="flex-1 bg-gradient-to-r from-emerald-600 to-orange-500 hover:from-emerald-500 hover:to-orange-400"
						disabled={isSubmitting}
					>
						{#if isSubmitting}
							Processando...
						{:else}
							Confirmar Resgate
						{/if}
					</Button>
				</AlertDialog.Footer>
			</form>
		{:else}
			<!-- Caso não tenha valor para resgatar -->
			<div class="mb-4 text-center">
				<p class="text-slate-400">Você ainda não possui recompensas disponíveis para resgate.</p>
				<p class="mt-1 text-sm text-slate-500">Continue indicando para acumular recompensas!</p>
			</div>

			<AlertDialog.Footer>
				<AlertDialog.Cancel asChild let:builder>
					<Button builders={[builder]} variant="outline" on:click={cancelarResgate} class="w-full">
						Entendi
					</Button>
				</AlertDialog.Cancel>
			</AlertDialog.Footer>
		{/if}
	</AlertDialog.Content>
</AlertDialog.Root>
