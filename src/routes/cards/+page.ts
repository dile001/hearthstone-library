import { cachedCards, cachedMetadata } from '$lib/stores/cards';
import { browser } from '$app/environment';
import { get } from 'svelte/store';

export async function load({ fetch }) {
	let cards = get(cachedCards);
	let metadata = get(cachedMetadata);

	if (browser && (!cards || !metadata)) {
		const [cardsRes, metadataRes] = await Promise.all([
			fetch('/api/cards'),
			fetch('/api/metadata')
		]);

		if (!cardsRes.ok || !metadataRes.ok) throw new Error('Failed to load data');

		const cardsData = await cardsRes.json();
		metadata = await metadataRes.json();
		cards = cardsData.cards;

		cachedCards.set(cards);
		cachedMetadata.set(metadata);
	}

	const classMap = Object.fromEntries(
		(metadata?.classes ?? []).map((cls: { id: number; name: string }) => [cls.id, cls.name])
	);

	return {
		cards: cards ?? [],
		classMap
	};
}
