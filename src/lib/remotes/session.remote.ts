import { getRequestEvent, query } from '$app/server';
import { ENABLE_BANKING_REDIRECT_PATH } from '$env/static/private';
import { db } from '$lib/server/db';
import { accountsTable, sessionsStatesTable, sessionsTable } from '$lib/server/db/schema';
import { createEBJWT } from '$lib/server/utils';
import type {
	EBAuthorizeSessionResponse,
	EBStartAuthorizationRequest,
	EBStartAuthorizationResponse
} from '$lib/types/enablebanking';
import { error } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { eq } from 'drizzle-orm';
import * as v from 'valibot';

export const getAuthorizationUrl = query(
	v.object({ aspspName: v.string(), aspspCountry: v.string(), maximumConsentValidity: v.number() }),
	async ({ aspspName, aspspCountry, maximumConsentValidity }) => {
		const { fetch, url } = getRequestEvent();

		const [{ state }] = await db
			.insert(sessionsStatesTable)
			.values({ maxConsentValidity: maximumConsentValidity })
			.returning({ state: sessionsStatesTable.state });

		const body: EBStartAuthorizationRequest = {
			access: {
				valid_until: dayjs().add(maximumConsentValidity, 'second').toISOString()
			},
			aspsp: {
				name: aspspName,
				country: aspspCountry
			},
			state,
			redirect_url: `https://${url.hostname}${ENABLE_BANKING_REDIRECT_PATH}`,
			language: 'fr'
		};

		const response = await fetch('https://api.enablebanking.com/auth', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${createEBJWT()}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		}).catch((err) => {
			console.error('Error fetching authorization URL from Enable Banking API:', err);
			error(500, 'Failed to retrieve authorization URL');
		});
		if (!response.ok) {
			console.error(
				`Error fetching authorization URL from Enable Banking API (Code: ${response.status}): ${await response.text()}`
			);
			error(500, 'Failed to retrieve authorization URL');
		}

		const sessionData: EBStartAuthorizationResponse = await response.json();

		return sessionData.url;
	}
);

export const authorizeSession = query(
	v.object({ state: v.string(), code: v.string() }),
	async ({ state, code }) => {
		const { fetch } = getRequestEvent();

		const existingState = await db
			.select({ maxConsentValidity: sessionsStatesTable.maxConsentValidity })
			.from(sessionsStatesTable)
			.where(eq(sessionsStatesTable.state, state));
		if (existingState.length === 0) {
			error(400, 'Invalid state');
		}
		await db.delete(sessionsStatesTable).where(eq(sessionsStatesTable.state, state));

		const response = await fetch('https://api.enablebanking.com/sessions', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${createEBJWT()}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ code })
		}).catch((err) => {
			console.error('Error fetching session data from Enable Banking API:', err);
			error(500, 'Failed to retrieve session data');
		});
		if (!response.ok) {
			console.error(
				`Error fetching session data from Enable Banking API (Code: ${response.status}): ${await response.text()}`
			);
			error(500, 'Failed to retrieve session data');
		}

		const sessionData: EBAuthorizeSessionResponse = await response.json();

		const validAccountIds = sessionData.accounts
			.map((account) => {
				if (account.uid) {
					return account.uid;
				}
			})
			.filter((id) => id !== undefined);

		const [insertedSession] = await db
			.insert(sessionsTable)
			.values({
				id: sessionData.session_id,
				slug: `${sessionData.aspsp.name.toLowerCase().replace(/\s+/g, '-')}-${sessionData.aspsp.country.toLowerCase()}-${sessionData.psu_type.toLowerCase()}`,
				maxConsentValidty: existingState[0].maxConsentValidity,
				psuType: sessionData.psu_type,
				aspsp: { name: sessionData.aspsp.name, country: sessionData.aspsp.country },
				linkedAccountsCount: validAccountIds.length,
				validUntil: dayjs(sessionData.access.valid_until).toDate()
			})
			.onConflictDoUpdate({
				target: sessionsTable.slug,
				set: {
					id: sessionData.session_id,
					maxConsentValidty: existingState[0].maxConsentValidity,
					linkedAccountsCount: validAccountIds.length,
					validUntil: dayjs(sessionData.access.valid_until).toDate()
				}
			})
			.returning({ id: sessionsTable.id, slug: sessionsTable.slug, aspsp: sessionsTable.aspsp });

		const accountsToInsert: (typeof accountsTable.$inferSelect)[] = validAccountIds.map(
			(accountId) => ({ id: accountId, sessionId: insertedSession.id })
		);

		await db.insert(accountsTable).values(accountsToInsert).onConflictDoNothing();

		return { slug: insertedSession.slug, aspsp: insertedSession.aspsp };
	}
);

export const getSessionAccountIds = query(v.string(), async (sessionId) => {
	const accountIds = await db
		.select({ id: accountsTable.id })
		.from(accountsTable)
		.where(eq(accountsTable.sessionId, sessionId));
	return accountIds.map((a) => a.id);
});
