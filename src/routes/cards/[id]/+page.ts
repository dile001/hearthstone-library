import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	const [cardRes, metaRes] = await Promise.all([
		fetch(`/api/cards/${params.id}`),
		fetch('/api/metadata')
	]);

	if (!cardRes.ok) {
		throw new Error('Card not found');
	}

	const card = await cardRes.json();
	const metadata = await metaRes.json();

	return {
		card,
		metadata
	};
};
