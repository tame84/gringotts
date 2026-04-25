import { db } from '$lib/server/db/index.js';
import { accountsTable, sessionsTable } from '$lib/server/db/schema.js';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ params }) => {
	const id = params.id;

	const account = await db
		.select({ id: accountsTable.id, aspsp: sessionsTable.aspsp })
		.from(accountsTable)
		.where(eq(accountsTable.id, id))
		.innerJoin(sessionsTable, eq(accountsTable.sessionId, sessionsTable.id));

	if (account.length === 0) {
		error(404, 'Account not found');
	}

	return {
		account: {
			id: account[0].id
		},
		aspsp: account[0].aspsp
	};
};
