<script lang="ts">
	import Button from '../button/button.svelte';

	export let currentPage: number;
	export let totalPages: number;
	export let onPageChange: (page: number) => void;

	const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

	function getVisiblePages() {
		const delta = 2;
		const left = currentPage - delta;
		const right = currentPage + delta + 1;
		const rangeWithDots: (number | string)[] = [];
		let l: number;

		for (let i = 1; i <= totalPages; i++) {
			if (i === 1 || i === totalPages || (i >= left && i < right)) {
				rangeWithDots.push(i);
			} else if (i < left && rangeWithDots[rangeWithDots.length - 1] !== '...') {
				rangeWithDots.push('...');
			} else if (i >= right && rangeWithDots[rangeWithDots.length - 1] !== '...') {
				rangeWithDots.push('...');
			}
		}

		return rangeWithDots;
	}
</script>

<nav class="flex items-center justify-center space-x-2" aria-label="Paginação">
	<Button
		variant="outline"
		size="sm"
		disabled={currentPage === 1}
		on:click={() => onPageChange(currentPage - 1)}
	>
		Anterior
	</Button>

	{#each getVisiblePages() as page}
		{#if page === '...'}
			<span class="px-2">...</span>
		{:else}
			<Button
				variant={currentPage === page ? 'default' : 'outline'}
				size="sm"
				on:click={() => onPageChange(Number(page))}
			>
				{page}
			</Button>
		{/if}
	{/each}

	<Button
		variant="outline"
		size="sm"
		disabled={currentPage === totalPages}
		on:click={() => onPageChange(currentPage + 1)}
	>
		Próximo
	</Button>
</nav>
