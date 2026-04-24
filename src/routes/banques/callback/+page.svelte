<script lang="ts">
	let { data } = $props();
</script>

{#if data.error}
	<h1>Erreur</h1>
	<p>Une erreur s'est produite lors de la récupération de la session.</p>
{/if}
