<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Textarea } from '../ui/textarea';
</script>

<AlertDialog.Root>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Informe o motivo do cancelamento</AlertDialog.Title>
			<AlertDialog.Description>
				<Textarea id="motivo" name="motivo" placeholder="Digite o motivo do cancelamento" />
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>
				<Button variant="outline">Cancelar</Button>
			</AlertDialog.Cancel>
			<Button variant="destructive">Confirmar</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
