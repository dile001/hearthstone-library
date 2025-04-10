<script lang="ts">
	export let form;
</script>

<div class="flex min-h-screen items-center justify-center bg-slate-900 px-4 text-white">
	<form method="POST" class="w-full max-w-sm rounded bg-slate-800 p-6 shadow">
		<h1 class="mb-4 text-xl font-bold">Login</h1>

		{#if form?.invalid}
			<p class="mb-2 text-sm text-red-400">Invalid credentials.</p>
		{/if}

		<input
			name="username"
			type="text"
			placeholder="Username"
			required
			class="mb-3 w-full rounded bg-slate-700 px-3 py-2"
		/>
		<input
			name="password"
			type="password"
			placeholder="Password"
			required
			class="mb-4 w-full rounded bg-slate-700 px-3 py-2"
		/>

		<button
			type="submit"
			class="w-full rounded bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700"
		>
			Log In
		</button>
	</form>
</div>
