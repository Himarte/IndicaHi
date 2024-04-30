<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button';
	export let data: PageData;
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
</script>

<form action="?/trocaEmail" method="post">
	<Card.Root class="w-full ">
		<Card.Header>
			<Card.Title>Troca de Email</Card.Title>
			<Card.Description>Você pode trocar o seu e-mail</Card.Description>
		</Card.Header>
		<Card.Content class="flex w-full items-center gap-5">
			<div class="flex w-1/2 flex-col gap-2">
				<Label for="oldEmail">Email Atual</Label>
				<Input id="oldEmail" name="oldEmail" type="email" placeholder={data.user?.email} />
			</div>
			<div class="flex w-1/2 flex-col gap-2">
				<Label for="newEmail">Novo e-mail</Label>
				<Input id="newEmail" name="newEmail" type="email" placeholder={'Digite o novo e-mail...'} />
			</div>
		</Card.Content>
		<Card.Footer class="flex items-center justify-end ">
			<Button class="h-7" type="submit" formaction="?/trocaEmail">Salvar</Button>
		</Card.Footer>
	</Card.Root>
</form>
<form method="post" action="?/editarDadosPagamento">
	<Card.Root class=" w-full  ">
		<Card.Header>
			<Card.Title>Dados para pagamentos</Card.Title>
			<Card.Description>Aqui vai suas informações de pagamento.</Card.Description>
		</Card.Header>
		<Card.Content class="flex w-full items-center gap-5">
			<div class="flex w-1/2 flex-col gap-2">
				<Label for="pixCode">Chave Pix</Label>
				<Input id="pixCode" name="pixCode" placeholder={'Não informado'} />
			</div>
			<div class="flex w-1/2 flex-col gap-2">
				<Label for="pixCode">Tipo de chave</Label>

				<div class="flex gap-5">
					<div class="flex items-center space-x-2">
						<Checkbox id="terms" />
						<Label
							for="terms"
							class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							CPF
						</Label>
					</div>
					<div class="flex items-center space-x-2">
						<Checkbox id="terms" />
						<Label
							for="terms"
							class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							CNPJ
						</Label>
					</div>
					<div class="flex items-center space-x-2">
						<Checkbox id="terms" />
						<Label
							for="terms"
							class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							E-mail
						</Label>
					</div>
					<div class="flex items-center space-x-2">
						<Checkbox id="terms" />
						<Label
							for="terms"
							class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Telefone
						</Label>
					</div>
				</div>
			</div>
		</Card.Content>
		<Card.Footer class="flex items-center justify-end ">
			<Button class="h-7" type="submit" formaction="?/editarDadosPagamento">Salvar</Button>
		</Card.Footer>
	</Card.Root>
</form>
