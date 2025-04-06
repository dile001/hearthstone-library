<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-6 text-white">
	<h1 class="mb-4 text-center text-5xl font-bold">🃏 Hearthstone Library</h1>
	<p class="mb-8 max-w-xl text-center text-xl text-gray-300">
		Browse and explore Hearthstone cards with ease. Filter by class, mana cost, and favorite the
		ones you love.
	</p>

	<button
		on:click={() => goto('/cards')}
		class="rounded bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition hover:bg-blue-700"
	>
		🔍 Explore Cards
	</button>
</div>
