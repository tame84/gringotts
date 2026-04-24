import { query } from '$app/server';
import { createEBJWT } from '$lib/server/utils';
import type { EBAccountResource, EBHalBalances } from '$lib/types/enablebanking';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

export const getAccountDetails = query.batch(v.string(), async (accountIds) => {
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

			const detailsData: EBAccountResource = await response.json();

			return {
				id: accountId,
				iban: detailsData.account_id?.iban || null,
				usage: detailsData.usage || null,
				type: detailsData.cash_account_type,
				holder: {
					name: detailsData.name || null
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

			const balance =
				balancesData.balances.find((balance) => balance.balance_type === 'ITBD') ||
				balancesData.balances.find((balance) => balance.balance_type === 'ITAV') ||
				balancesData.balances[0];

			return {
				accountId,
				type: balance.balance_type,
				currency: balance.balance_amount.currency,
				amount: balance.balance_amount.amount
			};
		})
	);

	const lookup = new Map(balances.map((b) => [b.accountId, b]));
	return (accountId) => lookup.get(accountId);
});
