<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import UserCreateForm from '$lib/components/FormAuth/CreateUser/UserCreateForm.svelte';
	import Paraqueda from '$lib/img/paraqueda.png';
	import { Separator } from '$lib/components/ui/separator';
	import Rocket from '$lib/img/melhor.png';

	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	export let page: PageData;
	export let form: ActionData;

	$: if (form?.status) {
		if (form.status === 400) {
			toast.warning(`${form.message}`, {
				duration: 3500
			});
		} else if (form.status === 500) {
			// Esse forme de erro é para o servidor
			toast.error(`${form.message}`, {
				duration: 3500
			});
		} else if (form.status === 200) {
			toast.success(`${form.message}`, {
				duration: 3500
			});
			goto('/perfil');
		} else {
			toast.error(`Erro desconhecido`, {
				duration: 3500
			});
		}
	}
</script>

<div class="relative flex h-full w-full">
	<div class="relative flex h-full w-full items-center">
		<div class="relative hidden h-full w-1/2 flex-col items-center justify-center md:flex">
			<p
				class="absolute top-[14rem] flex w-full flex-col items-center justify-center text-3xl font-bold"
			>
				Bem Vindo! <br />
				Vamos nessa jornada <br /> Juntos com a HIMARTE
			</p>

			<img
				src={Rocket}
				alt="Imagem de um foguete decolando"
				class="absolute bottom-0 hidden w-[99%] object-cover md:flex"
			/>
		</div>
		<Separator orientation="vertical" class=" hidden h-[35rem] w-[1px] rounded-full md:flex" />

		<div class="flex w-full justify-center px-5 py-44 md:w-1/2 md:px-0 md:py-0">
			<img
				src={Paraqueda}
				alt="Astronauta caindo de paraquedas"
				class="absolute -top-20 right-0 z-[1] w-64 rotate-0 opacity-15 md:-top-28 md:right-6 md:w-80 md:rotate-6 md:opacity-85"
			/>
			<span
				class="absolute -top-8 right-20 z-[2] h-[1px] w-[1px] rounded-full opacity-95 shadow-[0px_2px_50rem_30px] shadow-orange-600 md:right-44 md:h-32 md:w-32 md:shadow-[0px_2px_50rem_2rem]"
			></span>
			<div class=" flex h-full flex-col gap-6 md:w-full">
				<div class="flex flex-col space-y-2 text-center">
					<h1 class="text-2xl font-semibold tracking-tight">Crie uma conta</h1>
					<p class="text-sm text-muted-foreground">
						Cadastre seu email abaixo para criar sua conta
					</p>
				</div>
				<UserCreateForm />
			</div>
		</div>
	</div>
</div>
