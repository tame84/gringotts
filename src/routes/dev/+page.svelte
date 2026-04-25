<script lang="ts">
	import { getSessions } from '$lib/remotes/sessions.remote';
	import { toast } from 'svelte-sonner';
	import {
		getAccount,
		getAccountBalances,
		getAccountTransactions,
		getApplication
	} from './dev.remote';
	import { getAccounts } from '$lib/remotes/accounts.remote';

	let selectedAccountId: string | null = $state(null);
	let selectedTransactionStatus: 'BOOK' | 'SCHD' | 'N/A' = $state('N/A');

	let applicationData: Awaited<ReturnType<typeof getApplication>> | null = $state(null);
	let sessionsData: Awaited<ReturnType<typeof getSessions>> | null = $state(null);
	let accountsData: Awaited<ReturnType<typeof getAccounts>> | null = $state(null);
	let accountData: Awaited<ReturnType<typeof getAccount>> | null = $state(null);
	let accountBalancesData: Awaited<ReturnType<typeof getAccountBalances>> | null = $state(null);
	let accountTransactionsData: Awaited<ReturnType<typeof getAccountTransactions>> | null =
		$state(null);

	const getApplicationData = async () => {
		const promise = getApplication().run();

		toast.promise(promise, {
			loading: "Récupération des données d'application...",
			success: "Données d'application récupérées avec succès",
			error: "Erreur lors de la récupération des données d'application"
		});

		applicationData = await promise;
	};

	const getSessionsData = async () => {
		const promise = getSessions().run();

		toast.promise(promise, {
			loading: 'Récupération des sessions...',
			success: 'Sessions récupérées avec succès',
			error: 'Erreur lors de la récupération des sessions'
		});

		sessionsData = await promise;
	};

	const getAccountsData = async () => {
		const promise = getAccounts().run();

		toast.promise(promise, {
			loading: 'Récupération des comptes...',
			success: 'Comptes récupérés avec succès',
			error: 'Erreur lors de la récupération des comptes'
		});

		accountsData = await promise;
	};

	const getAccountData = async () => {
		if (!selectedAccountId) {
			toast.error('Veuillez entrer un ID de compte');
			return;
		}

		const promise = getAccount(selectedAccountId).run();

		toast.promise(promise, {
			loading: 'Récupération des données du compte...',
			success: 'Données du compte récupérées avec succès',
			error: 'Erreur lors de la récupération des données du compte'
		});

		accountData = await promise;
	};

	const getAccountBalancesData = async () => {
		if (!selectedAccountId) {
			toast.error('Veuillez entrer un ID de compte');
			return;
		}

		const promise = getAccountBalances(selectedAccountId).run();

		toast.promise(promise, {
			loading: 'Récupération des données de solde du compte...',
			success: 'Données de solde du compte récupérées avec succès',
			error: 'Erreur lors de la récupération des données de solde du compte'
		});

		accountBalancesData = await promise;
	};

	const getAccountTransactionsData = async () => {
		if (!selectedAccountId) {
			toast.error('Veuillez entrer un ID de compte');
			return;
		}

		const promise = getAccountTransactions({
			accountId: selectedAccountId,
			transactionStatus: selectedTransactionStatus
		}).run();

		toast.promise(promise, {
			loading: 'Récupération des données de transactions du compte...',
			success: 'Données de transactions du compte récupérées avec succès',
			error: 'Erreur lors de la récupération des données de transactions du compte'
		});

		accountTransactionsData = await promise;
	};
</script>

<h1>Development Tools</h1>

<h2>Application</h2>
<button onclick={getApplicationData}>Get application data</button>
<button onclick={() => (applicationData = null)}>Hide data</button>
{#if applicationData}
	<pre>{JSON.stringify(applicationData, null, 2)}</pre>
{/if}

<h2>Sessions</h2>
<button onclick={getSessionsData}>Get sessions data</button>
<button onclick={() => (sessionsData = null)}>Hide data</button>
{#if sessionsData}
	<pre>{JSON.stringify(sessionsData, null, 2)}</pre>
{/if}

<h2>Accounts</h2>
<button onclick={getAccountsData}>Get accounts data</button>
<button onclick={() => (accountsData = null)}>Hide data</button>
{#if accountsData}
	<pre>{JSON.stringify(accountsData, null, 2)}</pre>
{/if}

<h2>Account</h2>
<label for="accountId">Account ID</label>
<input type="text" id="accountId" bind:value={selectedAccountId} />
<span>Selected account ID: {selectedAccountId || 'N/A'}</span>

<h3>Get account data</h3>
<button onclick={getAccountData}>Get account data</button>
<button onclick={() => (accountData = null)}>Hide data</button>
{#if accountData}
	<pre>{JSON.stringify(accountData, null, 2)}</pre>
{/if}

<h3>Get account balances data</h3>
<button onclick={getAccountBalancesData}>Get account balances data</button>
<button onclick={() => (accountBalancesData = null)}>Hide data</button>
{#if accountBalancesData}
	<pre>{JSON.stringify(accountBalancesData, null, 2)}</pre>
{/if}

<h3>Get account transactions data</h3>
<label for="transactionStatus">Transaction status:</label>
<select name="transactionStatus" id="transactionStatus" bind:value={selectedTransactionStatus}>
	<option value="N/A">Undefined</option>
	<option value="BOOK">BOOK</option>
	<option value="SCHD">SCHD</option>
</select>
<button onclick={getAccountTransactionsData}>Get account transactions data</button>
<button onclick={() => (accountTransactionsData = null)}>Hide data</button>
{#if accountTransactionsData}
	<pre>{JSON.stringify(accountTransactionsData, null, 2)}</pre>
{/if}
