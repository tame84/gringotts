<script lang="ts">
	import { resolve } from '$app/paths';

	let { data } = $props();
</script>

{#if data.session}
	<h1>Succès !</h1>
	<p>
		{data.session.aspsp.name} ({data.session.aspsp.country}) a autorisé l'accès à votre compte.
	</p>
	<a href={resolve('/banques')}>Voir mes banques</a>
{:else}
	<h1>Erreur</h1>
	<p>Une erreur s'est produite lors de la récupération de la session.</p>
{/if}
