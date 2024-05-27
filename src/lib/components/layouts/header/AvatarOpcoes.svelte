<script>
	import Button from '../../ui/button/button.svelte';
</script>

<a href="/configuracoes" class="">Perfil</a>
<a href="/configuracoes/privacidade">Privacidade</a>
<form action="/logout" method="post" class="w-full">
	<Button variant="secondary" type="submit" class="mt-5 w-full">Sair</Button>
</form>
