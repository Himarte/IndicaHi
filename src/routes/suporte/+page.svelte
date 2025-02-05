<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import suporte from '$lib/img/suporte.svg';
	import whatsapp from '$lib/img/whastapp-icon.svg';
</script>

<div class="flex h-full w-full flex-col items-center">
	<img class="w-[30%]" src={suporte} alt="Suporte" loading="eager" />
	<div class="flex flex-col items-center gap-4">
		<h1 class="text-7xl font-bold">Precisa de ajuda?</h1>
		<p class="text-xl text-muted-foreground">
			Entre em contato com nosso suporte para resolver suas dúvidas.
		</p>
		<Button
			href="https://api.whatsapp.com/send/?phone=555130568251&text=Ola%21+Tudo+bem%3F&type=phone_number&app_absent=0"
			class="flex w-1/3 gap-2 bg-orange-600 py-5 font-semibold text-white hover:bg-orange-500"
		>
			<img class="w-7" src={whatsapp} alt="Whatsapp" />
			Entrar em contato
		</Button>
	</div>
</div>
