import { getRequestEvent, query } from '$app/server';
import { createEBJWT } from '$lib/server/utils';
import type { EBAccountResource, EBHalBalances, EBHalTransactions } from '$lib/types/enablebanking';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

export const getAccount = query.batch(v.string(), async (accountIds) => {
	const accounts = await Promise.all(
		accountIds.map(async (accountId) => {
			const response = await fetch(`https://api.enablebanking.com/accounts/${accountId}/details`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${createEBJWT()}`
				}
			}).catch((err) => {
				console.error('Error fetching account details from Enable Banking API:', err);
				error(500, 'Failed to retrieve accounts details');
			});
			if (!response.ok) {
				console.error(
					`Error fetching account details from Enable Banking API (Code: ${response.status}): ${await response.text()}`
				);
				error(500, 'Failed to retrieve accounts details');
			}

			const accountData: EBAccountResource = await response.json();

			return {
				id: accountId,
				iban: accountData.account_id?.iban || null,
				usage: accountData.usage || null,
				type: accountData.cash_account_type,
				holder: {
					name: accountData.name || null
				}
			};
		})
	);

	const lookup = new Map(accounts.map((a) => [a.id, a]));
	return (accountId) => lookup.get(accountId);
});

export const getAccountBalances = query.batch(v.string(), async (accountIds) => {
	const balances = await Promise.all(
		accountIds.map(async (accountId) => {
			const response = await fetch(`https://api.enablebanking.com/accounts/${accountId}/balances`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${createEBJWT()}`
				}
			}).catch((err) => {
				console.error('Error fetching account balances from Enable Banking API:', err);
				error(500, 'Failed to retrieve accounts balances');
			});
			if (!response.ok) {
				console.error(
					`Error fetching account balances from Enable Banking API (Code: ${response.status}): ${await response.text()}`
				);
				error(500, 'Failed to retrieve accounts balances');
			}

			const balancesData: EBHalBalances = await response.json();

			const availableBalance = balancesData.balances.find(
				(b) =>
					b.balance_type === 'ITAV' ||
					b.balance_type === 'XPCD' ||
					b.balance_type === 'CLAV' ||
					b.balance_type === 'FWAV' ||
					b.balance_type === 'OPAV'
			);
			const bookedBalance = balancesData.balances.find(
				(b) =>
					b.balance_type === 'ITBD' ||
					b.balance_type === 'CLBD' ||
					b.balance_type === 'OPBD' ||
					b.balance_type === 'PRCD'
			);

			return {
				accountId,
				availableBalance: availableBalance
					? {
							type: availableBalance.balance_type,
							name: availableBalance.name,
							currency: availableBalance.balance_amount.currency,
							amount: availableBalance.balance_amount.amount
						}
					: null,
				bookedBalance: bookedBalance
					? {
							type: bookedBalance.balance_type,
							name: bookedBalance.name,
							currency: bookedBalance.balance_amount.currency,
							amount: bookedBalance.balance_amount.amount
						}
					: null
			};
		})
	);

	const lookup = new Map(balances.map((b) => [b.accountId, b]));
	return (accountId) => lookup.get(accountId);
});

export const getAccountTransactions = query(
	v.object({
		accountId: v.string(),
		transactionStatus: v.pipe(v.optional(v.picklist(['BOOK', 'SCHD']), 'BOOK'))
	}),
	async ({ accountId, transactionStatus }) => {
		const { fetch } = getRequestEvent();

		const response = await fetch(
			`https://api.enablebanking.com/accounts/${accountId}/transactions?transaction_status=${transactionStatus}`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${createEBJWT()}`
				}
			}
		).catch((err) => {
			console.error('Error fetching account transactions from Enable Banking API:', err);
			error(500, 'Failed to retrieve accounts transactions');
		});
		if (!response.ok) {
			console.error(
				`Error fetching account transactions from Enable Banking API (Code: ${response.status}): ${await response.text()}`
			);
			error(500, 'Failed to retrieve accounts transactions');
		}

		const transactionsData: EBHalTransactions = await response.json();

		return {
			continuationKey: transactionsData.continuation_key || null,
			transactions: transactionsData.transactions.map((tx) => ({
				id: tx.transaction_id || crypto.randomUUID(),
				amount: tx.transaction_amount.amount,
				currency: tx.transaction_amount.currency,
				creditDebitIndicator: tx.credit_debit_indicator,
				creditor: {
					name: tx.creditor?.name || null,
					iban: tx.creditor_account?.iban || null
				},
				debtor: {
					name: tx.debtor?.name || null,
					iban: tx.debtor_account?.iban || null
				},
				valueDate: tx.value_date || null,
				transactionDate: tx.transaction_date || null,
				referenceNumber: tx.reference_number || null,
				status: tx.status,
				additionalInformations: {
					referenceNumber: tx.reference_number || null,
					bankTransactionCode: tx.bank_transaction_code?.code || null,
					remittanceInformation: tx.remittance_information || null
				}
			}))
		};
	}
);
