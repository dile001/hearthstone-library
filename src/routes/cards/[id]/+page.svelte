<script lang="ts">
	import { favorites } from '$lib/stores/favorites';
	export let data;

	const card = data.card;
	const metadata = data.metadata;

	const className = metadata.classes.find((c) => c.id === card.classId)?.name ?? 'Unknown';
	const typeName = metadata.types.find((t) => t.id === card.cardTypeId)?.name ?? 'Unknown';
	const setName = metadata.sets.find((s) => s.id === card.cardSetId)?.name ?? 'Unknown';

	function toggleFavorite() {
		favorites.update((current) =>
			current.includes(card.id)
				? current.filter((id) => id !== card.id)
				: [...current, card.id]
		);
	}
</script>

<div class="max-w-5xl mx-auto px-4 py-10">
	<a href="/cards" class="inline-block mb-6">
		<button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
			← Back to all cards
		</button>
	</a>

	<div class="flex items-center justify-between mb-6">
		<h1 class="text-4xl font-bold text-white">{card.name}</h1>
		<button
			on:click={toggleFavorite}
			class="text-3xl hover:text-yellow-300 transition"
		>
			{#if $favorites.includes(card.id)}⭐️{:else}☆{/if}
		</button>
	</div>

	<div class="bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col md:flex-row gap-6 items-center text-white">
		<img
			src={card.image}
			alt={card.name}
			class="w-64 rounded-lg shadow-md"
		/>

		<div class="text-left max-w-md">
			{#if card.flavorText}
				<p class="italic text-gray-300 mb-4">"{card.flavorText}"</p>
			{/if}

			<ul class="text-sm space-y-2 text-gray-300">
				<li><strong>Type:</strong> {typeName}</li>
				<li><strong>Class:</strong> {className}</li>
				<li><strong>Mana Cost:</strong> {card.manaCost}</li>
				<li><strong>Set:</strong> {setName}</li>
			</ul>
		</div>
	</div>
</div>
