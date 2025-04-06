<script lang="ts">
	import { writable, derived } from 'svelte/store';
	import { favorites } from '$lib/stores/favorites';

	export let data: {
		cards: Card[];
		classMap: Record<number, string>;
	};

	const search = writable('');
	const showOnlyFavorites = writable(false);
	const selectedMana = writable('all');
	const selectedClass = writable('all');

	const pageSize = 24;
	const currentPage = writable(1);
	const cards = writable(data.cards);

	const classOptions = derived(cards, ($cards) => {
		const seen = new Map<number, string>();
		for (const card of $cards) {
			if (card.classId && data.classMap[card.classId]) {
				seen.set(card.classId, data.classMap[card.classId]);
			}
		}
		return Array.from(seen.entries()).map(([id, name]) => ({ id, name }));
	});
	
	const filteredCards = derived(
		[search, showOnlyFavorites, selectedMana, selectedClass, favorites, cards],
		([$search, $showOnlyFavorites, $selectedMana, $selectedClass, $favorites, $cards]) => {
			return $cards.filter((card) => {
				const matchesSearch = card.name?.toLowerCase().includes($search.toLowerCase());
				const matchesFavorite = !$showOnlyFavorites || $favorites.includes(card.id);
				const matchesMana = $selectedMana === 'all' || card.manaCost === Number($selectedMana);
				const matchesClass = $selectedClass === 'all' || card.classId === Number($selectedClass);
				return matchesSearch && matchesFavorite && matchesMana && matchesClass;
			});
		}
	);

	const filteredPageCount = derived(filteredCards, ($filtered) =>
		Math.max(1, Math.ceil($filtered.length / pageSize))
	);

	const filtersAreClear = derived(
		[search, showOnlyFavorites, selectedMana, selectedClass],
		([$s, $f, $m, $c]) => $s === '' && !$f && $m === 'all' && $c === 'all'
	);

	const paginatedFilteredCards = derived(
		[filteredCards, currentPage],
		([$filtered, $page]) => {
			const start = ($page - 1) * pageSize;
			return $filtered.slice(start, start + pageSize);
		}
	);

	function changePage(delta: number) {
		currentPage.update((n) => Math.max(1, n + delta));
	}

	function resetFilters() {
		search.set('');
		showOnlyFavorites.set(false);
		selectedMana.set('all');
		selectedClass.set('all');
		currentPage.set(1);
	}

	$: if ($showOnlyFavorites) {
		currentPage.set(1);
	}
</script>

<div class="max-w-7xl mx-auto px-4 py-8">
	<h1 class="text-4xl font-bold text-white mb-6">Hearthstone Cards</h1>
	<div class="bg-slate-800 p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-center">
		<input
			type="text"
			placeholder="Search cards..."
			class="px-4 py-2 rounded bg-slate-700 text-white placeholder-gray-400 outline-none"
			bind:value={$search}
		/>
		<label class="flex items-center gap-2 text-white">
			<input type="checkbox" bind:checked={$showOnlyFavorites} /> Favorites only
		</label>
		<select bind:value={$selectedMana} class="px-3 py-2 rounded bg-slate-700 text-white">
			<option value="all">All Mana</option>
			{#each Array.from({ length: 11 }, (_, i) => i) as mana (mana)}
				<option value={mana}>{mana}</option>
			{/each}
		</select>
		<select bind:value={$selectedClass} class="px-3 py-2 rounded bg-slate-700 text-white">
			<option value="all">All Classes</option>
			{#each $classOptions as cls (cls.id)}
				<option value={cls.id}>{cls.name}</option>
			{/each}
		</select>
		<button
			on:click={resetFilters}
			disabled={$filtersAreClear}
			class="px-4 py-2 rounded transition {$filtersAreClear ? 'bg-gray-500 text-gray-300 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}"
		>
			Clear Filters
		</button>
	</div>

	<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
		{#each $paginatedFilteredCards as card (card.id)}
			<div class="relative transition transform duration-200 hover:-translate-y-1 hover:shadow-xl">
				<button
					on:click|stopPropagation={() => {
						favorites.update((current) =>
							current.includes(card.id)
								? current.filter((id) => id !== card.id)
								: [...current, card.id]
						);
					}}
					class="absolute top-2 right-2 z-10 text-xl hover:text-yellow-300 transition"
				>
					{#if $favorites.includes(card.id)}⭐️{:else}☆{/if}
				</button>
				<a href={`/cards/${card.id}`} class="block">
					<img src={card.image} alt={card.name} class="mb-2 rounded" />
				</a>
			</div>
		{/each}
	</div>

	<div class="flex justify-center mt-8 gap-4">
		{#if $currentPage > 1}
			<button on:click={() => changePage(-1)} class="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600">
				← Previous
			</button>
		{/if}
		<p class="text-white text-sm mt-2">
			Page {$currentPage} of {$filteredPageCount}
		</p>
		{#if $currentPage < $filteredPageCount}
			<button on:click={() => changePage(1)} class="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600">
				Next →
			</button>
		{/if}
	</div>
</div>