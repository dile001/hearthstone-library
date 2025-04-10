import { getUserFromCookie } from '$lib/server/auth';
import type { LayoutServerLoad } from './$types';
import type { User } from '$lib/stores/user';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const username = getUserFromCookie(cookies);

	const user: User | null = username ? { username } : null;

	return { user };
};
