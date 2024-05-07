<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import UserLoginForm from '$lib/components/FormAuth/LoginUser/UserLoginForm.svelte';
	import Paraqueda from '$lib/img/paraqueda.webp';
	import { Separator } from '$lib/components/ui/separator';
	import Rocket from '$lib/img/melhor.webp';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';

	export let form: ActionData;

	$: if (form?.message) {
		if (form?.status === 400) {
			toast.warning(`${form?.message}`, {
				duration: 3500
			});
		} else if (form?.status === 401) {
			toast.warning(`${form?.message}`, {
				duration: 3500
			});
		} else if (form.status === 200) {
			toast.success(`${form.message}`, {
				duration: 3500
			});
			goto('/dashboard');
		} else {
			toast.error(`Erro desconhecido, entre em contato com o suporte`, {
				duration: 3500
			});
			goto('/');
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
				loading="lazy"
				alt="Imagem de um foguete decolando"
				class="absolute bottom-0 hidden w-[99%] object-cover md:flex"
				in:fly={{ y: 100, duration: 300 }}
			/>
		</div>
		<Separator orientation="vertical" class="  hidden h-[35rem] w-[1px] rounded-full md:flex" />

		<div class="flex w-full justify-center px-5 py-44 md:w-1/2 md:px-0 md:py-0">
			<img
				src={Paraqueda}
				loading="lazy"
				alt="Astronauta caindo de paraquedas"
				class="absolute -top-20 right-0 z-[1] w-64 rotate-0 opacity-15 md:-top-28 md:right-6 md:w-80 md:rotate-6 md:opacity-85"
				in:fade={{ duration: 500 }}
			/>
			<span
				class="absolute -top-8 right-20 z-[2] h-[1px] w-[1px] rounded-full opacity-95 shadow-[0px_2px_50rem_30px] shadow-orange-600 md:right-44 md:h-32 md:w-32 md:shadow-[0px_2px_50rem_2rem]"
			></span>
			<div class=" flex h-full flex-col gap-6 md:w-[350px]">
				<div class="flex flex-col space-y-2 text-center">
					<h1 class="text-2xl font-semibold tracking-tight">Acesse sua conta</h1>
				</div>
				<UserLoginForm />
			</div>
		</div>
	</div>
</div>
