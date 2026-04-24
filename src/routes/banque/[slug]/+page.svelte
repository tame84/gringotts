<script lang="ts">
	import { resolve } from '$app/paths';
	import Account from '$lib/components/account.svelte';
	import { getAccountBalances, getAccountDetails } from '$lib/remotes/account.remote.js';
	import { getSessionAccountIds } from '$lib/remotes/session.remote.js';
	import { getCountryDisplayName } from '$lib/utils.js';
	import dayjs from 'dayjs';

	let { data } = $props();
</script>

<header>
	<h1>{data.aspsp.name} - {getCountryDisplayName('fr', data.aspsp.country)}</h1>
	<nav>
		<a href={resolve('/banques')}>Mes banques</a>
	</nav>
</header>

{#if data.isNew}
	Votre banque a été liée jusqu’au {dayjs(data.session.validUntil)
		.toDate()
		.toLocaleDateString('fr', {
			minute: 'numeric',
			hour: 'numeric',
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})} avec succès ! {data.session.linkedAccountsCount} nouveaux comptes ont été ajoutés.
{/if}

<svelte:boundary>
	{#snippet pending()}
		<p>Chargement des comptes...</p>
	{/snippet}

	<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
	{#snippet failed(error, reset)}
		<p>Une erreur est survenue.</p>
		<button onclick={reset}>Réessayer</button>
	{/snippet}

	<ul>
		{#each await getSessionAccountIds(data.session.id) as accountId (accountId)}
			<Account
				details={await getAccountDetails(accountId)}
				balances={await getAccountBalances(accountId)}
			/>
		{/each}
	</ul>
</svelte:boundary>
