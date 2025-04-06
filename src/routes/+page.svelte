<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<div class="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-6">
	<h1 class="text-5xl font-bold mb-4 text-center">🃏 Hearthstone Library</h1>
	<p class="text-xl text-gray-300 mb-8 text-center max-w-xl">
		Browse and explore Hearthstone cards with ease. Filter by class, mana cost, and favorite the ones you love.
	</p>

	<button
		on:click={() => goto('/cards')}
		class="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded text-white text-lg font-semibold transition"
	>
		🔍 Explore Cards
	</button>
</div>
