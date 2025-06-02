<script>
	import Button from '../../ui/button/button.svelte';
	import { ROUTES } from '$lib/uteis/routes';
</script>

<a href={ROUTES.CONFIGURACOES}>Perfil</a>
<a href={ROUTES.CONFIGURACOES_PRIVACIDADE}>Privacidade</a>
<form action={ROUTES.LOGOUT} method="post" class="w-full">
	<Button variant="secondary" type="submit" class="mt-5 w-full">Sair</Button>
</form>
