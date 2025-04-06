import { cachedCards, cachedMetadata } from '$lib/stores/cards';
import { get } from 'svelte/store';

export async function load({ fetch }) {
	let cards, metadata;

	if (get(cachedCards) && get(cachedMetadata)) {
		cards = get(cachedCards);
		metadata = get(cachedMetadata);
	} else {
		const cardsRes = await fetch('/api/cards');
		const metadataRes = await fetch('/api/metadata');

		if (!cardsRes.ok || !metadataRes.ok) throw new Error('Failed to load data');

		const cardsData = await cardsRes.json();
		metadata = await metadataRes.json();
		cards = cardsData.cards;

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
