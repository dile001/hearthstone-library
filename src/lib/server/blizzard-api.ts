import {
	PRIVATE_BLIZZARD_CLIENT_ID,
	PRIVATE_BLIZZARD_CLIENT_SECRET
} from '$env/static/private';

const TOKEN_URL = 'https://oauth.battle.net/token';
const API_URL = 'https://eu.api.blizzard.com';

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function fetchAccessToken(): Promise<string> {
	if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken!;

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

	const data = await res.json();
	cachedToken = data.access_token;
	tokenExpiresAt = Date.now() + data.expires_in * 1000;
	return cachedToken!;
}

export async function fetchCards(): Promise<Card[]> {
	const token = await fetchAccessToken();

	const res = await fetch(`${API_URL}/hearthstone/cards?locale=en_US&page=1&pageSize=2000`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	const data = await res.json();
	console.log('res', data.cards.length)
	return data.cards;
}


export async function fetchMetadata(): Promise<any> {
	const token = await fetchAccessToken();

	const res = await fetch(`${API_URL}/hearthstone/metadata?locale=en_US`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	return await res.json();
}
