import { writable } from 'svelte/store';

export const cachedCards = writable<Card[] | null>(null);
export const cachedMetadata = writable<any | null>(null);
export const cardsLoading = writable(true);
