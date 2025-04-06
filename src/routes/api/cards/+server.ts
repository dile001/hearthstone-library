import { json } from '@sveltejs/kit';
import { PRIVATE_BLIZZARD_CLIENT_ID, PRIVATE_BLIZZARD_CLIENT_SECRET } from '$env/static/private';

const TOKEN_URL = 'https://oauth.battle.net/token';
const API_URL = 'https://eu.api.blizzard.com';

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function fetchAccessToken(): Promise<string> {
	if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken!;

	if (!PRIVATE_BLIZZARD_CLIENT_ID || !PRIVATE_BLIZZARD_CLIENT_SECRET) {
		throw new Error('Missing Blizzard API credentials');
	}

	const params = new URLSearchParams();
	params.append('grant_type', 'client_credentials');

	const basicAuth = btoa(`${PRIVATE_BLIZZARD_CLIENT_ID}:${PRIVATE_BLIZZARD_CLIENT_SECRET}`);

	const res = await fetch(TOKEN_URL, {
		method: 'POST',
		headers: {
			Authorization: `Basic ${basicAuth}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: params.toString()
	});

	if (!res.ok) {
		const err = await res.text();
		throw new Error(`Auth failed: ${err}`);
	}

	const data = await res.json();
	cachedToken = data.access_token;
	tokenExpiresAt = Date.now() + data.expires_in * 1000;

	return cachedToken!;
}

export async function GET() {
	const token = await fetchAccessToken();
	const pageSize = 1000;

	const allCards = [];
	let page = 1;
	let totalPages = 1;

	do {
		const res = await fetch(
			`${API_URL}/hearthstone/cards?locale=en_US&page=${page}&pageSize=${pageSize}`,
			{
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		);

		if (!res.ok) {
			const err = await res.text();
			throw new Error(`Failed to fetch cards page ${page}: ${err}`);
		}

		const data = await res.json();

		allCards.push(...data.cards);
		totalPages = data.pageCount;
		page++;
	} while (page <= totalPages);

	return json({ cards: allCards });
}
