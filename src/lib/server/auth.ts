import { redirect, type RequestEvent } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { serialize, type CookieSerializeOptions } from 'cookie';

const USER = {
	username: 'admin',
	password: 'password123'
};

const SESSION_NAME = 'session_id';
const COOKIE_OPTIONS: CookieSerializeOptions = {
	httpOnly: true,
	sameSite: 'lax',
	secure: !dev,
	path: '/',
	maxAge: 60 * 60 * 24
};

export function login(username: string, password: string): boolean {
	return username === USER.username && password === USER.password;
}

export function destroySessionCookie(): string {
	return serialize(SESSION_NAME, '', { ...COOKIE_OPTIONS, maxAge: 0 });
}

export function getUserFromCookie(cookies: RequestEvent['cookies']): string | null {
	const session = cookies.get(SESSION_NAME);
	if (!session) return null;

	return session === USER.username ? USER.username : null;
}

export function requireAuth(event: RequestEvent) {
	const user = getUserFromCookie(event.cookies);
	if (!user) throw redirect(302, '/login');
	return user;
}
