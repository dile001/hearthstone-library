import { writable } from 'svelte/store';

const stored = typeof localStorage !== 'undefined'
	? localStorage.getItem('favorites')
	: null;

const initial = stored ? JSON.parse(stored) : [];

export const favorites = writable<number[]>(initial);

favorites.subscribe((value) => {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem('favorites', JSON.stringify(value));
	}
});
