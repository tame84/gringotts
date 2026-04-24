<script lang="ts">
	import { resolve } from '$app/paths';
	import Account from '$lib/components/account.svelte';
	import { getAccountBalances, getAccountDetails } from '$lib/remotes/account.remote';
	import { getAccounts } from '$lib/remotes/accounts.remote';
</script>

<header>
	<h1>Mes comptes</h1>
	<nav>
		<a href={resolve('/banques')}>Mes banques</a>
	</nav>
</header>

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
		{#each await getAccounts() as account (account.id)}
			<Account
				details={await getAccountDetails(account.id)}
				balances={await getAccountBalances(account.id)}
				aspsp={account.aspsp}
			/>
		{/each}
	</ul>
</svelte:boundary>
