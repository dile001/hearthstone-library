<script lang="ts">
	export let form;
</script>

<div class="min-h-screen flex items-center justify-center bg-slate-900 text-white px-4">
	<form method="POST" class="bg-slate-800 p-6 rounded shadow max-w-sm w-full">
		<h1 class="text-xl font-bold mb-4">Login</h1>

		{#if form?.invalid}
			<p class="text-red-400 text-sm mb-2">Invalid credentials.</p>
		{/if}

		<input name="username" type="text" placeholder="Username" required class="mb-3 w-full px-3 py-2 rounded bg-slate-700" />
		<input name="password" type="password" placeholder="Password" required class="mb-4 w-full px-3 py-2 rounded bg-slate-700" />

		<button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded">
			Log In
		</button>
	</form>
</div>
