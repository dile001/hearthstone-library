import { get } from 'svelte/store';
import { cachedCards, cachedMetadata } from '$lib/stores/cards';
import { fetchCards, fetchMetadata } from '$lib/server/blizzard-api';
import { error } from '@sveltejs/kit';
import { requireAuth } from '$lib/server/auth';

export async function load(event) {
	requireAuth(event);

	let cards = get(cachedCards);
	let metadata = get(cachedMetadata);

	if (!cards || !metadata) {
		cards = await fetchCards();
		metadata = await fetchMetadata();

		cachedCards.set(cards);
		cachedMetadata.set(metadata);
	}

	const card = cards.find((c) => c.id === Number(event.params.id));
	if (!card) throw error(404, 'Card not found');

	return {
		card,
		metadata
	};
}
