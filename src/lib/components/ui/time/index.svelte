<script lang="ts">
	import Time from 'svelte-time';
	import 'dayjs/locale/pt-br';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';

	dayjs.extend(relativeTime);
	dayjs.locale('pt-br');

	export let timestamp: string | Date;
	export let format: string = '';
	export let relative = false;
	export let live = false;
</script>

{#if format}
	<Time {timestamp} {relative} {live} {format} />
{:else}
	<Time {timestamp} {relative} {live} />
{/if}
