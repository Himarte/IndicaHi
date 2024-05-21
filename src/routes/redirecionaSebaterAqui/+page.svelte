<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let name = data.name;
	console.log(name);

	let email = data.email;
</script>

<h1 class="text-white">Ola {name}</h1>
<p>Seu email é {email}</p>
