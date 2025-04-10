import { get } from 'svelte/store';
import { cachedCards, cachedMetadata } from '$lib/stores/cards';
import { fetchCards, fetchMetadata } from '$lib/server/blizzard-api';
import { requireAuth } from '$lib/server/auth'; // for route protection

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

	const classMap = Object.fromEntries(
		metadata.classes.map((cls: { id: number; name: string }) => [cls.id, cls.name])
	);

	return {
		cards,
		classMap
	};
}
