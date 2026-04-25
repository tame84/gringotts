<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { Toaster } from 'svelte-sonner';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Toaster position="bottom-center" />

{@render children()}

<footer>
	<p>© Gringotts - Réalisé par Dino Valentini</p>
</footer>
