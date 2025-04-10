<script lang="ts">
	import { favorites } from '$lib/stores/favorites';
	import { goto } from '$app/navigation';
	export let data;

	const card = data.card;
	const metadata = data.metadata;

	const className = metadata.classes.find((c) => c.id === card.classId)?.name ?? 'Unknown';
	const typeName = metadata.types.find((t) => t.id === card.cardTypeId)?.name ?? 'Unknown';
	const setName = metadata.sets.find((s) => s.id === card.cardSetId)?.name ?? 'Unknown';

	function toggleFavorite() {
		favorites.update((current) =>
			current.includes(card.id) ? current.filter((id) => id !== card.id) : [...current, card.id]
		);
	}
</script>

<div class="mx-auto max-w-5xl px-4 py-10">
	<button
		on:click={() => goto('/cards')}
		class="mb-6 rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
	>
		← Back to all cards
	</button>

	<div class="mb-6 flex gap-2 sm:items-center sm:justify-between">
		<h1 class="text-4xl font-bold text-white">{card.name}</h1>
		<button
			on:click={toggleFavorite}
			class="self-start text-3xl transition hover:text-yellow-300 sm:self-auto"
		>
			{#if $favorites.includes(card.id)}⭐️{:else}☆{/if}
		</button>
	</div>

	<div
		class="flex flex-col items-center gap-6 rounded-lg bg-slate-800 p-6 text-white shadow-lg md:flex-row"
	>
		<img src={card.image} alt={card.name} class="w-56 rounded-lg shadow-md sm:w-64" />

		<div class="max-w-md text-left">
			{#if card.flavorText}
				<p class="mb-4 max-w-xs text-gray-300 italic sm:max-w-none">"{card.flavorText}"</p>
			{/if}

			<ul class="space-y-2 text-sm text-gray-300">
				<li><strong>Type:</strong> {typeName}</li>
				<li><strong>Class:</strong> {className}</li>
				<li><strong>Mana Cost:</strong> {card.manaCost}</li>
				<li><strong>Set:</strong> {setName}</li>
			</ul>
		</div>
	</div>
</div>
