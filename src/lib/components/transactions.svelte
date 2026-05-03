<script lang="ts">
	import type { getAccountTransactions } from '$lib/remotes/account.remote';

	interface Props {
		transactions: Awaited<ReturnType<typeof getAccountTransactions>>['transactions'];
		continuationKey?: string;
	}

	let { transactions }: Props = $props();

	let selectedTransaction: string | null = $state(null);
</script>

{#if transactions.length > 0}
	{#each transactions as transaction, i (i)}
		<tr onclick={() => (selectedTransaction = transaction.id)}>
			{#if transaction.creditDebitIndicator === 'DBIT'}
				<td
					><p>{transaction.creditor.name || 'Inconnu'}</p>
					<span>{transaction.creditor.iban}</span></td
				>
				<td>-{transaction.amount} {transaction.currency}</td>
			{:else}
				<td
					><p>{transaction.debtor.name || 'Inconnu'}</p>
					<span>{transaction.debtor.iban}</span></td
				>
				<td>+{transaction.amount} {transaction.currency}</td>
			{/if}
			<td>{transaction.transactionDate || '-'}</td>
			<td>{transaction.valueDate || '-'}</td>
			{#if selectedTransaction === transaction.id}
				<td colspan="4">
					{#if transaction.additionalInformations.referenceNumber}
						<div>
							<span>Référence</span>
							<p>{transaction.additionalInformations.referenceNumber}</p>
						</div>
					{/if}
					{#if transaction.additionalInformations.bankTransactionCode}
						<div>
							<span>Code de transaction bancaire</span>
							<p>{transaction.additionalInformations.bankTransactionCode}</p>
						</div>
					{/if}
					{#if transaction.additionalInformations.remittanceInformation && transaction.additionalInformations.remittanceInformation.length > 0}
						<div>
							<span>Autres informations</span>
							<ul>
								{#each transaction.additionalInformations.remittanceInformation as info, i (i)}
									<li>{info}</li>
								{/each}
							</ul>
						</div>
					{/if}
				</td>
			{/if}
		</tr>
	{/each}
{:else}
	<tr>
		<td colspan="4">Aucune transaction n'a été trouvée.</td>
	</tr>
{/if}
