import { getRequestEvent, query } from '$app/server';
import { createEBJWT } from '$lib/server/utils';
import type {
	EBAccountResource,
	EBGetApplicationResponse,
	EBHalBalances,
	EBHalTransactions
} from '$lib/types/enablebanking';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

export const getApplication = query(async () => {
	const { fetch } = getRequestEvent();

	const response = await fetch('https://api.enablebanking.com/application', {
		headers: {
			Authorization: `Bearer ${createEBJWT()}`
		}
	}).catch((err) => {
		console.error('Error fetching application data from Enable Banking API:', err);
		error(500, 'Failed to retrieve application data');
	});
	if (!response.ok) {
		console.error(
			`Error fetching application data from Enable Banking API (Code: ${response.status}): ${await response.text()}`
		);
		error(500, 'Failed to retrieve application data');
	}

	const applicationData: EBGetApplicationResponse = await response.json();
	return applicationData;
});

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
				...accountData
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
			return {
				accountId,
				...balancesData
			};
		})
	);

	const lookup = new Map(balances.map((b) => [b.accountId, b]));
	return (accountId) => lookup.get(accountId);
});

export const getAccountTransactions = query(
	v.object({
		accountId: v.string(),
		transactionStatus: v.pipe(v.optional(v.picklist(['BOOK', 'SCHD', 'N/A']), 'BOOK'))
	}),
	async ({ accountId, transactionStatus }) => {
		const { fetch } = getRequestEvent();

		let response;

		if (transactionStatus === 'N/A') {
			response = await fetch(`https://api.enablebanking.com/accounts/${accountId}/transactions`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${createEBJWT()}`
				}
			}).catch((err) => {
				console.error('Error fetching account transactions from Enable Banking API:', err);
				error(500, 'Failed to retrieve accounts transactions');
			});
		} else {
			response = await fetch(
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
		}

		if (!response.ok) {
			console.error(
				`Error fetching account transactions from Enable Banking API (Code: ${response.status}): ${await response.text()}`
			);
			error(500, 'Failed to retrieve accounts transactions');
		}

		const transactionsData: EBHalTransactions = await response.json();
		return transactionsData;
	}
);
