import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { login } from '$lib/server/auth';
import { dev } from '$app/environment';

export const load: PageServerLoad = async ({ cookies }) => {
	const user = cookies.get('session_id');
	if (user === 'admin') throw redirect(302, '/cards');
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const username = formData.get('username')?.toString() ?? '';
		const password = formData.get('password')?.toString() ?? '';

		if (!login(username, password)) {
			return fail(401, { invalid: true });
		}

		cookies.set('session_id', username, {
			httpOnly: true,
			sameSite: 'lax',
			secure: !dev,
			path: '/',
			maxAge: 60 * 60 * 24
		});

		throw redirect(302, '/cards');
	}
};
