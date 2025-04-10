<script lang="ts">
	import '../app.css';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import { loading } from '$lib/stores/loading';
	import { user } from '$lib/stores/user';

	export let data: { user: import('$lib/stores/user').User | null };

	user.set(data.user);

	beforeNavigate(() => {
		loading.set(true);
	});

	afterNavigate(() => {
		loading.set(false);
	});
</script>

<slot />

{#if $loading}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
	</div>
{/if}
