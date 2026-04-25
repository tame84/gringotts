<script lang="ts">
	import { resolve } from '$app/paths';
	import Transactions from '$lib/components/transactions.svelte';
	import {
		getAccountBalances,
		getAccount,
		getAccountTransactions
	} from '$lib/remotes/account.remote.js';

	let { data } = $props();

	let accountPromise = $derived(getAccount(data.account.id));
	let balancesPromise = $derived(getAccountBalances(data.account.id));

	let account = $derived(await accountPromise);
	let balances = $derived(await balancesPromise);
</script>

<header>
	<div>
		<h1>{data.aspsp?.name} - {data.aspsp?.country}</h1>
		<a href={resolve('/')}>Mes comptes</a>
	</div>
</header>

<div>
	<div>
		<h2>{account?.holder.name}</h2>
		<p>{account?.iban}</p>
	</div>
	<div>
		<p>
			{balances?.amount}
			{balances?.currency}
		</p>
	</div>
</div>

<div>
	<div>
		<h3>Transactions à venir</h3>
		<table>
			<thead>
				<tr>
					<th>Expéditeur/Bénéficiaire</th>
					<th>Montant</th>
					<th>Date de transaction</th>
					<th>Date de valeur</th>
				</tr>
			</thead>
			<tbody>
				<svelte:boundary>
					{#snippet pending()}
						<tr>
							<td colspan="4">Chargement des transactions...</td>
						</tr>
					{/snippet}

					<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
					{#snippet failed(error, reset)}
						<tr>
							<td colspan="4">
								<p>Une erreur est survenue.</p>
								<button onclick={reset}>Réessayer</button>
							</td>
						</tr>
					{/snippet}

					{@const { transactions } = await getAccountTransactions({
						accountId: data.account.id,
						transactionStatus: 'SCHD'
					})}

					<Transactions {transactions} />
				</svelte:boundary>
			</tbody>
		</table>
	</div>
	<div>
		<h3>Historique des transactions</h3>
		<table>
			<thead>
				<tr>
					<th>Expéditeur/Bénéficiaire</th>
					<th>Montant</th>
					<th>Date de transaction</th>
					<th>Date de valeur</th>
				</tr>
			</thead>
			<tbody>
				<svelte:boundary>
					{#snippet pending()}
						<tr>
							<td colspan="4">Chargement des transactions...</td>
						</tr>
					{/snippet}

					<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
					{#snippet failed(error, reset)}
						<tr>
							<td colspan="4">
								<p>Une erreur est survenue.</p>
								<button onclick={reset}>Réessayer</button>
							</td>
						</tr>
					{/snippet}

					{@const { transactions } = await getAccountTransactions({
						accountId: data.account.id,
						transactionStatus: 'BOOK'
					})}

					<Transactions {transactions} />
				</svelte:boundary>
			</tbody>
		</table>
	</div>
</div>
