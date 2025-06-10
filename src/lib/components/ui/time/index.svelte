<script lang="ts">
	import Time from 'svelte-time';
	import 'dayjs/locale/pt-br';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';

	dayjs.extend(relativeTime);
	dayjs.locale('pt-br');

	interface Props {
		timestamp: string | Date;
		format?: string;
		relative?: boolean;
		live?: boolean;
	}

	let { timestamp, format = '', relative = false, live = false }: Props = $props();
</script>

{#if format}
	<Time {timestamp} {relative} {live} {format} />
{:else}
	<Time {timestamp} {relative} {live} />
{/if}
