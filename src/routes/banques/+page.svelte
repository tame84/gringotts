<script lang="ts">
	import { getApplicationCountries } from '$lib/remotes/application.remote';
	import { getAspsps } from '$lib/remotes/aspsps.remote';
	import { getAuthorizationUrl } from '$lib/remotes/session.remote';
	import { getSessions } from '$lib/remotes/sessions.remote';
	import { getCountryDisplayName, getPsuTypeDisplayName } from '$lib/utils';
	import { resolve } from '$app/paths';

	let selectedCountry = $state('');
	let searchBankName = $state('');
	let selectedAspsp = $state<{
		name: string;
		country: string;
		maximumConsentValidity: number;
	} | null>(null);

	let aspspsPromise = $derived(getAspsps(selectedCountry));
	let authorizationUrlPromise = $derived.by(() => {
		if (selectedAspsp) {
			return getAuthorizationUrl({
				aspspName: selectedAspsp.name,
				aspspCountry: selectedAspsp.country,
				maximumConsentValidity: selectedAspsp.maximumConsentValidity
			});
		} else {
			return null;
		}
	});
</script>

<header>
	<div>
		<h1>Mes banques</h1>
		<a href={resolve('/comptes')}>Mes comptes</a>
	</div>
	<button commandfor="addBankDialog" command="show-modal">Ajouter une banque</button>
</header>

<ul>
	{#each await getSessions() as session (session.id)}
		<li>
			<a href={resolve('/banque/[slug]', { slug: session.slug })}>
				<span>{getPsuTypeDisplayName(session.psuType)}</span>
				<h3>{session.aspsp.name} - {getCountryDisplayName('fr', session.aspsp.country)}</h3>
				<p>
					{session.linkedAccountsCount}
					<span>{session.linkedAccountsCount > 1 ? 'comptes liés' : 'compte lié'}</span>
				</p>
			</a>
		</li>
	{/each}
</ul>

<dialog id="addBankDialog" closedby="any">
	<h2>Ajouter une banque</h2>
	<svelte:boundary>
		{#snippet pending()}
			<p>Chargement des données...</p>
		{/snippet}

		<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
		{#snippet failed(error, reset)}
			<p>Une erreur est survenue.</p>
			<button onclick={reset}>Réessayer</button>
		{/snippet}

		<div>
			<label for="country">Pays</label>
			<select id="country" name="country" bind:value={selectedCountry}>
				<option value="" selected disabled>Séléctionner un pays</option>
				{#each await getApplicationCountries() as country (country.code)}
					<option value={country.code}>{country.name}</option>
				{/each}
			</select>
		</div>
		<div>
			<label for="bank">Banque</label>
			<input type="text" id="bank" bind:value={searchBankName} />
			<div>
				{#if selectedCountry}
					{#if aspspsPromise.loading}
						<p>Chargement des banques...</p>
					{:else if aspspsPromise.ready}
						<ul>
							{#each (await aspspsPromise).filter((aspsp) => aspsp.name
									.toLowerCase()
									.includes(searchBankName.toLowerCase())) as aspsp, i (i + aspsp.name)}
								<li>
									<button
										onclick={() =>
											(selectedAspsp = {
												name: aspsp.name,
												country: aspsp.country,
												maximumConsentValidity: aspsp.maximum_consent_validity
											})}
										><img src={aspsp.logo} width="24" alt={aspsp.name} />
										{aspsp.name}</button
									>
								</li>
							{/each}
						</ul>
					{:else}
						<p>Une erreur est survenue lors du chargement des banques.</p>
					{/if}
				{:else}
					<p>Veuillez sélectionner un pays pour afficher les banques disponibles.</p>
				{/if}
			</div>
		</div>
	</svelte:boundary>
	<p>
		Banque sélectionnée : {selectedAspsp
			? `${selectedAspsp.name} (${getCountryDisplayName('fr', selectedAspsp.country)})`
			: '/'}
	</p>
	<a
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		href={authorizationUrlPromise && authorizationUrlPromise.ready
			? await authorizationUrlPromise
			: null}
		>{authorizationUrlPromise?.loading ? 'Génération du lien...' : 'Autoriser la connexion'}</a
	>
	<button commandfor="addBankDialog" command="request-close">Annuler</button>
</dialog>
