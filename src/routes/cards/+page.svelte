<script lang="ts">
	import { writable, derived } from 'svelte/store';
	import { favorites } from '$lib/stores/favorites';
	import { goto } from '$app/navigation';

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

	const paginatedFilteredCards = derived([filteredCards, currentPage], ([$filtered, $page]) => {
		const start = ($page - 1) * pageSize;
		return $filtered.slice(start, start + pageSize);
	});

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

<div class="mx-auto max-w-7xl px-4 py-8">
	<h1 class="mb-6 text-4xl font-bold text-white">Hearthstone Cards</h1>
	<div class="mb-6 flex flex-wrap items-center gap-4 rounded-lg bg-slate-800 p-4 shadow">
		<input
			type="text"
			placeholder="Search cards..."
			class="rounded bg-slate-700 px-4 py-2 text-white placeholder-gray-400 outline-none"
			bind:value={$search}
		/>
		<label class="flex items-center gap-2 text-white">
			<input type="checkbox" bind:checked={$showOnlyFavorites} /> Favorites only
		</label>
		<select bind:value={$selectedMana} class="rounded bg-slate-700 px-3 py-2 text-white">
			<option value="all">All Mana</option>
			{#each Array.from({ length: 11 }, (_, i) => i) as mana (mana)}
				<option value={mana}>{mana}</option>
			{/each}
		</select>
		<select bind:value={$selectedClass} class="rounded bg-slate-700 px-3 py-2 text-white">
			<option value="all">All Classes</option>
			{#each $classOptions as cls (cls.id)}
				<option value={cls.id}>{cls.name}</option>
			{/each}
		</select>
		<button
			on:click={resetFilters}
			disabled={$filtersAreClear}
			class="rounded px-4 py-2 transition {$filtersAreClear
				? 'cursor-not-allowed bg-gray-500 text-gray-300'
				: 'bg-red-600 text-white hover:bg-red-700'}"
		>
			Clear Filters
		</button>

		<button
			on:click={() => goto('/logout')}
			class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
		>
			Logout
		</button>
	</div>

	<div class="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
		{#each $paginatedFilteredCards as card (card.id)}
			<div class="relative transform transition duration-200 hover:-translate-y-1 hover:shadow-xl">
				<button
					on:click|stopPropagation={() => {
						favorites.update((current) =>
							current.includes(card.id)
								? current.filter((id) => id !== card.id)
								: [...current, card.id]
						);
					}}
					class="absolute top-2 right-2 z-10 text-xl transition hover:text-yellow-300"
				>
					{#if $favorites.includes(card.id)}⭐️{:else}☆{/if}
				</button>
				<a href={`/cards/${card.id}`} class="block">
					<img src={card.image} alt={card.name} class="mb-2 rounded" />
				</a>
			</div>
		{/each}
	</div>

	<div class="mt-8 flex justify-center gap-4">
		{#if $currentPage > 1}
			<button
				on:click={() => changePage(-1)}
				class="rounded bg-slate-700 px-4 py-2 text-white hover:bg-slate-600"
			>
				← Previous
			</button>
		{/if}
		<p class="mt-2 text-sm text-white">
			Page {$currentPage} of {$filteredPageCount}
		</p>
		{#if $currentPage < $filteredPageCount}
			<button
				on:click={() => changePage(1)}
				class="rounded bg-slate-700 px-4 py-2 text-white hover:bg-slate-600"
			>
				Next →
			</button>
		{/if}
	</div>
</div>
