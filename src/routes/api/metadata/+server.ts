import { json } from '@sveltejs/kit';
import {
	PRIVATE_BLIZZARD_CLIENT_ID,
	PRIVATE_BLIZZARD_CLIENT_SECRET
} from '$env/static/private';

const TOKEN_URL = 'https://oauth.battle.net/token';
const METADATA_URL = 'https://eu.api.blizzard.com/hearthstone/metadata?locale=en_US';

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

export async function GET() {
	const token = await fetchAccessToken();

	const res = await fetch(METADATA_URL, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	if (!res.ok) {
		const error = await res.text();
		return json({ error }, { status: res.status });
	}

	const metadata = await res.json();
	return json(metadata);
}
