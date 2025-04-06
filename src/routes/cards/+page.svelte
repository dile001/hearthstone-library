<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { writable } from 'svelte/store';
	import { favorites } from '$lib/stores/favorites';

	function buildUrlWithFilters(page = 1) {
		const params = new URLSearchParams();

		if ($search) params.set('search', $search);
		if ($selectedMana !== 'all') params.set('mana', $selectedMana);
		if ($selectedClass !== 'all') params.set('class', $selectedClass);
		if ($showOnlyFavorites) params.set('favorites', 'true');

		params.set('page', page.toString());
		return `/cards?${params.toString()}`;
	}


	$: if ($showOnlyFavorites && $page.url.searchParams.get('page') !== '1') {
		goto(buildUrlWithFilters(1));
	}

	export let data;

	const search = writable('');
	const showOnlyFavorites = writable(false);
	const selectedMana = writable('all');
	const selectedClass = writable('all');

	$: currentPage = Number($page.url.searchParams.get('page') ?? '1');
	$: pageCount = $page.data.pageCount;
	$: cards = $page.data.cards;
	$: metadata = $page.data.metadata;
	$: classOptions = metadata.classes;

	$: filteredCards = cards.filter((card) => {
		const matchesSearch = card.name?.toLowerCase().includes($search.toLowerCase());
		const matchesFavorite = !$showOnlyFavorites || $favorites.includes(card.id);
		const matchesMana = $selectedMana === 'all' || card.manaCost === Number($selectedMana);
		const matchesClass = $selectedClass === 'all' || card.classId === Number($selectedClass);
		return matchesSearch && matchesFavorite && matchesMana && matchesClass;
	});

	$: filtersAreClear =
		$search === '' &&
		!$showOnlyFavorites &&
		$selectedMana === 'all' &&
		$selectedClass === 'all';
</script>

<div class="max-w-7xl mx-auto px-4 py-8">
	<a href="/" class="inline-block mb-4">
		<button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
			← Back to homepage
		</button>
	</a>
	<h1 class="text-4xl font-bold text-white mb-6">Hearthstone Cards</h1>
	<div class="bg-slate-800 p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-center">
		<input
			type="text"
			placeholder="Search cards..."
			class="px-4 py-2 rounded bg-slate-700 text-white placeholder-gray-400 outline-none"
			bind:value={$search}
		/>

		<label class="flex items-center gap-2 text-white">
			<input type="checkbox" bind:checked={$showOnlyFavorites} />
			Favorites only
		</label>

		<select bind:value={$selectedMana} class="px-3 py-2 rounded bg-slate-700 text-white">
			<option value="all">All Mana</option>
			{#each Array.from({ length: 11 }, (_, i) => i) as mana}
				<option value={mana}>{mana}</option>
			{/each}
		</select>

		<select bind:value={$selectedClass} class="px-3 py-2 rounded bg-slate-700 text-white">
			<option value="all">All Classes</option>
			{#each classOptions as cls}
				<option value={cls.id}>{cls.name}</option>
			{/each}
		</select>

		<button
			on:click={() => {
			search.set('');
			showOnlyFavorites.set(false);
			selectedMana.set('all');
			selectedClass.set('all');
		}}
			disabled={filtersAreClear}
			class="px-4 py-2 rounded transition
			{filtersAreClear ? 'bg-gray-500 text-gray-300 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}"
		>
			Clear Filters
		</button>
	</div>
	<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
		{#each filteredCards as card}
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
					{#if $favorites.includes(card.id)}
						⭐️
					{:else}
						☆
					{/if}
				</button>

				<a href={`/cards/${card.id}`} class="block">
					<img src={card.image} alt={card.name} class="mb-2 rounded" />
					<h2 class="text-lg font-semibold">{card.name}</h2>
				</a>
			</div>
		{/each}
	</div>

	<div class="flex justify-center mt-8 gap-4">
		{#if currentPage > 1}
			<button
				on:click={() => goto(`/cards?page=${currentPage - 1}`)}
				class="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600"
			>
				← Previous
			</button>
		{/if}

		<p class="text-white text-sm mt-2">Page {currentPage} of {pageCount}</p>

		{#if currentPage < pageCount}
			<button
				on:click={() => goto(`/cards?page=${currentPage + 1}`)}
				class="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600"
			>
				Next →
			</button>
		{/if}
	</div>
</div>