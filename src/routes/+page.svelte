<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<div
	class="flex min-h-screen flex-col items-center justify-center px-6 bg-slate-900 text-white"
>
	<h1 class="mb-4 text-center text-5xl font-bold">Hearthstone Library</h1>
	<p class="mb-8 max-w-xl text-center text-xl text-gray-700 dark:text-gray-300">
		Browse and explore Hearthstone cards with ease. Filter by class, mana cost, and favorite the
		ones you love.
	</p>

	<button
		on:click={() => goto('/cards')}
		class="rounded px-6 py-3 text-lg font-semibold text-white transition bg-blue-700 hover:bg-blue-800"
	>
		Explore Cards
	</button>
</div>
