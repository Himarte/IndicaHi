<script lang="ts">
	import Time from 'svelte-time';
	import 'dayjs/locale/pt-br';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';

	dayjs.extend(relativeTime);
	dayjs.locale('pt-br');

	export let timestamp: string | Date;
	export let relative = false;
	export let live = false;
</script>

<Time {timestamp} {relative} {live} />
