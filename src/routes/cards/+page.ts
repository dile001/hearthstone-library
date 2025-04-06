export async function load({ fetch, url }) {
	const page = Number(url.searchParams.get('page') ?? '1');
	const pageSize = 24;

	const cardsRes = await fetch(`/api/cards?page=${page}&pageSize=${pageSize}`);
	const metadataRes = await fetch('/api/metadata');

	if (!cardsRes.ok || !metadataRes.ok) throw new Error('Failed to load data');

	const cardsData = await cardsRes.json();
	const metadata = await metadataRes.json();

	console.log('[DEBUG] Incoming page param:', page);
	console.log('[DEBUG] Blizzard returned:', cardsData.page);

	return {
		cards: cardsData.cards,
		page,
		pageCount: cardsData.pageCount,
		metadata
	};
}
